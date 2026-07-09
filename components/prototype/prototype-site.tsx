"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ColorScheme } from "@/lib/theme";
import { getStoredTheme, getPreferredTheme, setTheme } from "@/lib/theme";
import { colorsToCssVars, getColors } from "@/lib/prototype-colors";
import BackgroundCanvas from "@/components/prototype/background-canvas";
import AiOrb from "@/components/prototype/ai-orb";
import HeroSection from "@/components/prototype/sections/hero-section";
import ApproachSection from "@/components/prototype/sections/approach-section";
import WorkSection from "@/components/prototype/sections/work-section";
import AiSection from "@/components/prototype/sections/ai-section";
import CommSection from "@/components/prototype/sections/comm-section";
import MindSection from "@/components/prototype/sections/mind-section";
import PersonalSection from "@/components/prototype/sections/personal-section";
import PathSection from "@/components/prototype/sections/path-section";
import ReposSection from "@/components/prototype/sections/repos-section";
import ContactSection from "@/components/prototype/sections/contact-section";
import { trackPageview } from "@/lib/visitor-client";
import {
  CASES,
  DOCS,
  METRICS,
  NAV_ITEMS,
} from "@/lib/prototype-data";

const CASE_ROTATE_MS = 6000;
const DOC_ROTATE_MS = 5500;
const TAB_PAUSE_MS = 14000;

const REVEAL_IDS = ["hero", "approach", "work", "ai", "comm", "mind", "personal", "path", "repos", "contact"] as const;

function parseMetric(str: string) {
  const m = String(str).match(/^([\d,]+)/);
  if (!m) return { num: null as number | null, suffix: "", raw: str };
  return { num: parseInt(m[1].replace(/,/g, ""), 10), suffix: str.slice(m[0].length), raw: str };
}

function formatMetric(n: number, t: { suffix: string }) {
  return n.toLocaleString("en-US") + (t.suffix || "");
}

export default function PrototypeSite() {
  const [theme, setThemeState] = useState<ColorScheme>("dark");
  const [activeCase, setActiveCase] = useState(0);
  const [activeDoc, setActiveDoc] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState("hero");
  const [personaTick, setPersonaTick] = useState(0);
  const [metricsStarted, setMetricsStarted] = useState(false);
  const [metricsVals, setMetricsVals] = useState<string[] | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const caseRotatePausedRef = useRef(false);
  const docRotatePausedRef = useRef(false);
  const casePauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const docPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTickingRef = useRef(false);
  const sectionCacheRef = useRef<{ id: string; top: number; bottom: number }[]>([]);
  const cacheDirtyRef = useRef(true);

  const colors = getColors(theme);
  const cssVars = colorsToCssVars(colors);

  const startMetrics = useCallback(() => {
    if (metricsStarted) return;
    setMetricsStarted(true);
    const targets = METRICS.map((m) => parseMetric(m.n));
    const start = Date.now();
    const dur = 1100;
    metricsIntervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const vals = targets.map((t) =>
        t.num === null ? t.raw : formatMetric(Math.round(t.num * eased), t),
      );
      setMetricsVals(vals);
      if (p >= 1 && metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
    }, 80);
  }, [metricsStarted]);

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
    startMetrics();
  }, [startMetrics]);

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

  const pickDoc = useCallback((i: number) => {
    setActiveDoc(i);
    docRotatePausedRef.current = true;
    if (docPauseTimerRef.current) clearTimeout(docPauseTimerRef.current);
    docPauseTimerRef.current = setTimeout(() => {
      docRotatePausedRef.current = false;
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
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (docRotatePausedRef.current) return;
      setActiveDoc((i) => (i + 1) % DOCS.length);
    }, DOC_ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (casePauseTimerRef.current) clearTimeout(casePauseTimerRef.current);
      if (docPauseTimerRef.current) clearTimeout(docPauseTimerRef.current);
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
    const personaTimer = setInterval(() => setPersonaTick((t) => (t + 1) % 3), 2200);
    const fallbackTimer = setTimeout(revealAll, 700);

    const revealObs = new IntersectionObserver(
      (entries) => {
        let needRefresh = false;
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-reveal-id");
          if (entry.isIntersecting && id) {
            setRevealed((s) => {
              if (s[id]) return s;
              if (id === "personal") startMetrics();
              return { ...s, [id]: true };
            });
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
      clearInterval(personaTimer);
      clearTimeout(fallbackTimer);
      clearTimeout(obsTimer);
      revealObs.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [revealAll, startMetrics, handleScroll, refreshSectionCache]);

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <div className="pt-root" id="top" style={cssVars} data-theme={theme}>
      <BackgroundCanvas theme={theme} />

      <nav className={`pt-nav ${scrolled ? "pt-nav--scrolled" : ""}`}>
        <a href="#top" className="pt-nav-brand">
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
            className="pt-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className={`pt-theme-knob ${theme === "dark" ? "pt-theme-knob--dark" : "pt-theme-knob--light"}`} />
          </button>
        </div>
      </nav>

      <HeroSection
        revealed={!!revealed.hero}
        personaTick={personaTick}
      />

      <ApproachSection
        revealed={!!revealed.approach}
        personaTick={personaTick}
      />

      <WorkSection
        revealed={!!revealed.work}
        activeCase={activeCase}
        pickCase={pickCase}
      />

      <AiSection
        revealed={!!revealed.ai}
      />

      <CommSection
        revealed={!!revealed.comm}
        activeDoc={activeDoc}
        pickDoc={pickDoc}
      />

      <MindSection
        revealed={!!revealed.mind}
      />

      <PersonalSection
        revealed={!!revealed.personal}
        metricsVals={metricsVals}
      />

      <PathSection
        revealed={!!revealed.path}
      />

      <ReposSection
        revealed={!!revealed.repos}
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
