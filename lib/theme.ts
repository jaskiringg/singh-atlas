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

/** Default site theme when nothing is stored — light first. */
export function getPreferredTheme(): ColorScheme {
  return "light";
}

export function initTheme() {
  const stored = getStoredTheme();
  document.documentElement.dataset.colorScheme = stored ?? getPreferredTheme();
}