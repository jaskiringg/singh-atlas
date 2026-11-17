"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ColorScheme } from "@/lib/theme";
import { getStoredTheme, getPreferredTheme, setTheme } from "@/lib/theme";
import { colorsToCssVars, getColors } from "@/lib/prototype-colors";
import BackgroundCanvas from "@/components/prototype/background-canvas";
import AiOrb from "@/components/prototype/ai-orb";
import HeroSection from "@/components/prototype/sections/hero-section";
import WorkSection from "@/components/prototype/sections/work-section";
import CapabilitiesSection from "@/components/prototype/sections/capabilities-section";
import LabSection from "@/components/prototype/sections/lab-section";
import ApproachSection from "@/components/prototype/sections/approach-section";
import ExperienceSection from "@/components/prototype/sections/experience-section";
import ContactSection from "@/components/prototype/sections/contact-section";
import { trackPageview } from "@/lib/visitor-client";
import { CASES, NAV_ITEMS } from "@/lib/prototype-data";

const CASE_ROTATE_MS = 8000;
const TAB_PAUSE_MS = 16000;

const REVEAL_IDS = ["overview", "work", "capabilities", "lab", "approach", "experience", "contact"] as const;

export default function PrototypeSite() {
  const [theme, setThemeState] = useState<ColorScheme>("light");
  const [activeCase, setActiveCase] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState("overview");
  const [personaTick, setPersonaTick] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const caseRotatePausedRef = useRef(false);
  const casePauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTickingRef = useRef(false);
  const sectionCacheRef = useRef<{ id: string; top: number; bottom: number }[]>([]);
  const cacheDirtyRef = useRef(true);

  const colors = getColors(theme);
  const cssVars = colorsToCssVars(colors);

  const revealAll = useCallback(() => {
    setRevealed((prev) => {
      const merged = { ...prev };
      let changed = false;
      REVEAL_IDS.forEach((id) => {
        if (!merged[id]) {
          merged[id] = true;
          changed = true;
        }
      });
      return changed ? merged : prev;
    });
  }, []);

  const refreshSectionCache = useCallback(() => {
    cacheDirtyRef.current = false;
    const nodes = document.querySelectorAll("[data-section-id]");
    sectionCacheRef.current = Array.from(nodes).map((n) => {
      const r = n.getBoundingClientRect();
      return { id: n.getAttribute("data-section-id") || "", top: r.top, bottom: r.bottom };
    });
  }, []);

  useEffect(() => {
    trackPageview();
  }, []);

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored ?? getPreferredTheme());
  }, []);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const pickCase = useCallback((i: number) => {
    setActiveCase(i);
    caseRotatePausedRef.current = true;
    if (casePauseTimerRef.current) clearTimeout(casePauseTimerRef.current);
    casePauseTimerRef.current = setTimeout(() => {
      caseRotatePausedRef.current = false;
    }, TAB_PAUSE_MS);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (caseRotatePausedRef.current) return;
      setActiveCase((i) => (i + 1) % CASES.length);
    }, CASE_ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (casePauseTimerRef.current) clearTimeout(casePauseTimerRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTickingRef.current) return;
    scrollTickingRef.current = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      setScrolled(y > 40);

      if (cacheDirtyRef.current) refreshSectionCache();

      const vh = window.innerHeight;
      const vhCenter = vh / 2;
      let closest: string | null = null;
      let closestDist = Infinity;
      const sections = sectionCacheRef.current;
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (s.bottom < 0 || s.top > vh) continue;
        const dist = Math.abs((s.top + s.bottom) / 2 - vhCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = s.id;
        }
      }
      if (closest) setActiveSection(closest);
      scrollTickingRef.current = false;
    });
  }, [refreshSectionCache]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const personaTimer = reduced ? null : setInterval(() => setPersonaTick((t) => (t + 1) % 3), 3200);
    const fallbackTimer = setTimeout(revealAll, 700);

    const revealObs = new IntersectionObserver(
      (entries) => {
        let needRefresh = false;
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-reveal-id");
          if (entry.isIntersecting && id) {
            setRevealed((s) => (s[id] ? s : { ...s, [id]: true }));
            needRefresh = true;
          }
        });
        if (needRefresh) refreshSectionCache();
      },
      { threshold: 0.12 },
    );

    const observeAll = () => {
      document.querySelectorAll("[data-reveal-id]").forEach((node) => {
        revealObs.observe(node);
      });
    };
    observeAll();
    const obsTimer = setTimeout(() => {
      observeAll();
      cacheDirtyRef.current = true;
      refreshSectionCache();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => { cacheDirtyRef.current = true; }, { passive: true });
    handleScroll();

    return () => {
      if (personaTimer) clearInterval(personaTimer);
      clearTimeout(fallbackTimer);
      clearTimeout(obsTimer);
      revealObs.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [revealAll, handleScroll, refreshSectionCache]);

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <div className="pt-root" id="top" style={cssVars} data-theme={theme}>
      <BackgroundCanvas theme={theme} />

      <nav className={`pt-nav ${scrolled ? "pt-nav--scrolled" : ""}`}>
        <a href="#overview" className="pt-nav-brand">
          <span className="pt-nav-brand-diamond" />
          jaskirat.sys
        </a>
        <div className="pt-nav-right">
          <div className="pt-nav-links" data-navlinks>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`pt-nav-link ${activeSection === item.id ? "pt-nav-link--active" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="pt-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
          <button
            type="button"
            className="pt-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className={`pt-theme-knob ${theme === "dark" ? "pt-theme-knob--dark" : "pt-theme-knob--light"}`} />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="pt-mobile-menu">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "is-on" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}

      <HeroSection
        revealed={!!revealed.overview}
        personaTick={personaTick}
      />

      <WorkSection
        revealed={!!revealed.work}
        activeCase={activeCase}
        pickCase={pickCase}
      />

      <CapabilitiesSection
        revealed={!!revealed.capabilities}
      />

      <LabSection
        revealed={!!revealed.lab}
      />

      <ApproachSection
        revealed={!!revealed.approach}
        personaTick={personaTick}
      />

      <ExperienceSection
        revealed={!!revealed.experience}
      />

      <ContactSection
        revealed={!!revealed.contact}
      />

      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "26px clamp(20px,5vw,56px)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span>Jaskirat Singh · 2026</span>
        <span>Built, not generated.</span>
      </footer>

      <div className="pt-quick-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            title={item.label}
            className={`pt-quick-dot ${activeSection === item.id ? "pt-quick-dot--active" : ""}`}
          />
        ))}
      </div>

      <AiOrb />
    </div>
  );
}
