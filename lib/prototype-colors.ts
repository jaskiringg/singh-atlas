import type { ColorScheme } from "./theme";

export type ThemeColors = {
  bg: string;
  bg2: string;
  bg3: string;
  line: string;
  line2: string;
  ink: string;
  ink2: string;
  ink3: string;
  accent: string;
  accent2: string;
  accent3: string;
  neon1: string;
  neon2: string;
  neon3: string;
  neon4: string;
};

export function getColors(theme: ColorScheme): ThemeColors {
  const base =
    theme === "light"
      ? {
          bg: "#f3efe6",
          bg2: "#fffdf9",
          bg3: "#e8e2d8",
          line: "#ddd6ca",
          line2: "#cfc6b8",
          ink: "#111111",
          ink2: "#333333",
          ink3: "#666666",
          accent: "#6d4ed6",
          accent2: "#5a3fc0",
          accent3: "#8b6ce8",
        }
      : {
          bg: "#0a0b14",
          bg2: "#10121f",
          bg3: "#171a2b",
          line: "#23253d",
          line2: "#34375a",
          ink: "#ecebf7",
          ink2: "#a6a6c6",
          ink3: "#6d6d90",
          accent: "#9b82ff",
          accent2: "#2cd6b8",
          accent3: "#c08bff",
        };

  return {
    ...base,
    neon1: theme === "light" ? "#6d4ed6" : "#8b9cff",
    neon2: theme === "light" ? "#8b6ce8" : "#b9a4ff",
    neon3: theme === "light" ? "#5a3fc0" : "#9b82ff",
    neon4: theme === "light" ? "#6d4ed6" : "#c4b5fd",
  };
}

export function colorsToCssVars(c: ThemeColors): Record<string, string> {
  return {
    "--bg": c.bg,
    "--bg2": c.bg2,
    "--bg3": c.bg3,
    "--line": c.line,
    "--line2": c.line2,
    "--ink": c.ink,
    "--ink2": c.ink2,
    "--ink3": c.ink3,
    "--accent": c.accent,
    "--accent2": c.accent2,
    "--accent3": c.accent3,
    "--neon1": c.neon1,
    "--neon2": c.neon2,
    "--neon3": c.neon3,
    "--neon4": c.neon4,
  } as Record<string, string>;
}
