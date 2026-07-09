"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#top" className="nav-mark">
        <span className="sig" aria-hidden />
        <span>jaskirat singh</span>
      </a>
      <div className="nav-end">
        <div className="nav-links">
          <a href="#approach">approach</a>
          <a href="#work">work</a>
          <a href="#ai">ai</a>
          <a href="#communicate">communicate</a>
          <a href="#repos">repos</a>
          <a href="#personal">personal</a>
          <a href="#path">path</a>
          <a href="#contact">contact</a>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
