"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, getPreferredTheme, setTheme, type ColorScheme } from "@/lib/theme";

export function ThemeToggle() {
  const [scheme, setScheme] = useState<ColorScheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.dataset.colorScheme as ColorScheme) ||
      getStoredTheme() ||
      getPreferredTheme();
    setScheme(current);
    setReady(true);
  }, []);

  const toggle = () => {
    const next: ColorScheme = scheme === "dark" ? "light" : "dark";
    setTheme(next);
    setScheme(next);
  };

  if (!ready) {
    return <span className="theme-toggle theme-toggle--ghost" aria-hidden />;
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={scheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={scheme === "dark" ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-icon" aria-hidden>
        {scheme === "dark" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z" />
          </svg>
        )}
      </span>
      <span className="theme-toggle-label">{scheme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
