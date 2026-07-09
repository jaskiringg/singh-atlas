"use client";

import { useEffect, useState } from "react";

const STOPS = [
  { id: "top", label: "Hero" },
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "ai", label: "AI + comms" },
  { id: "repos", label: "Repos" },
  { id: "personal", label: "Personal" },
  { id: "contact", label: "Contact" },
];

/** Fixed right-edge dots — click to jump, current section lights up. */
export function QuickNav() {
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.1, 0.3, 0.6] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Thin progress line behind the dots — fills top-to-bottom with overall
  // scroll progress. Single scroll listener, doesn't touch the section
  // active-state logic above.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="quicknav" aria-label="Quick section jump">
      <span className="quicknav-track" aria-hidden />
      <span className="quicknav-fill" style={{ height: `${progress * 100}%` }} aria-hidden />
      {STOPS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""} aria-label={s.label}>
          <span className="qn-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
