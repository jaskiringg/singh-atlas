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
          bg: "#F4F3EF",
          bg2: "#FFFFFF",
          bg3: "#EEEDE8",
          line: "#E2E0D9",
          line2: "#E2E0D9",
          ink: "#201F2A",
          ink2: "#201F2A",
          ink3: "#777783",
          accent: "#7955E8",
          accent2: "#7955E8",
          accent3: "#7955E8",
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
    neon1: theme === "light" ? "#7955E8" : "#8b9cff",
    neon2: theme === "light" ? "#7955E8" : "#b9a4ff",
    neon3: theme === "light" ? "#7955E8" : "#9b82ff",
    neon4: theme === "light" ? "#7955E8" : "#c4b5fd",
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
