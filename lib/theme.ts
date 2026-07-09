export type ColorScheme = "light" | "dark";

const STORAGE_KEY = "atlas-theme";

export function getStoredTheme(): ColorScheme | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : null;
}

export function setTheme(scheme: ColorScheme) {
  document.documentElement.dataset.colorScheme = scheme;
  localStorage.setItem(STORAGE_KEY, scheme);
}

export function getPreferredTheme(): ColorScheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function initTheme() {
  const stored = getStoredTheme();
  document.documentElement.dataset.colorScheme = stored ?? getPreferredTheme();
}
