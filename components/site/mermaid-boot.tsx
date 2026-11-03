"use client";

import { useEffect, useRef } from "react";

type Scheme = "light" | "dark";

function readScheme(): Scheme {
  if (typeof document === "undefined") return "dark";
  const s = document.documentElement.dataset.colorScheme;
  return s === "light" ? "light" : "dark";
}

/** Portfolio-matched Mermaid theme (same tokens as prototype). */
function themeVariables(scheme: Scheme) {
  if (scheme === "light") {
    return {
      darkMode: false,
      background: "#eceaf8",
      primaryColor: "#ffffff",
      primaryTextColor: "#17162e",
      primaryBorderColor: "#8257f5",
      secondaryColor: "#e1def5",
      tertiaryColor: "#d6d3ef",
      secondaryTextColor: "#474563",
      tertiaryTextColor: "#6f6d92",
      lineColor: "#b7b3e2",
      textColor: "#17162e",
      mainBkg: "#ffffff",
      nodeBorder: "#b7b3e2",
      clusterBkg: "rgba(255,255,255,0.72)",
      clusterBorder: "#d6d3ef",
      titleColor: "#17162e",
      edgeLabelBackground: "#ffffff",
      actorBkg: "#ffffff",
      actorBorder: "#8257f5",
      actorTextColor: "#17162e",
      actorLineColor: "#b7b3e2",
      signalColor: "#474563",
      signalTextColor: "#17162e",
      labelBoxBkgColor: "#ffffff",
      labelBoxBorderColor: "#b7b3e2",
      labelTextColor: "#17162e",
      loopTextColor: "#17162e",
      noteBkgColor: "#e1def5",
      noteTextColor: "#17162e",
      noteBorderColor: "#8257f5",
      activationBkgColor: "#e1def5",
      activationBorderColor: "#8257f5",
      sequenceNumberColor: "#ffffff",
      fontFamily: "IBM Plex Mono, ui-monospace, monospace",
      fontSize: "13px",
    };
  }

  return {
    darkMode: true,
    background: "#0a0b14",
    primaryColor: "#171a2b",
    primaryTextColor: "#ecebf7",
    primaryBorderColor: "#9b82ff",
    secondaryColor: "#10121f",
    tertiaryColor: "#23253d",
    secondaryTextColor: "#a6a6c6",
    tertiaryTextColor: "#6d6d90",
    lineColor: "#6d6d90",
    textColor: "#ecebf7",
    mainBkg: "#171a2b",
    nodeBorder: "#34375a",
    clusterBkg: "rgba(16,18,31,0.92)",
    clusterBorder: "#34375a",
    titleColor: "#ecebf7",
    edgeLabelBackground: "#10121f",
    actorBkg: "#171a2b",
    actorBorder: "#9b82ff",
    actorTextColor: "#ecebf7",
    actorLineColor: "#34375a",
    signalColor: "#a6a6c6",
    signalTextColor: "#ecebf7",
    labelBoxBkgColor: "#10121f",
    labelBoxBorderColor: "#34375a",
    labelTextColor: "#ecebf7",
    loopTextColor: "#ecebf7",
    noteBkgColor: "#171a2b",
    noteTextColor: "#ecebf7",
    noteBorderColor: "#9b82ff",
    activationBkgColor: "#23253d",
    activationBorderColor: "#9b82ff",
    sequenceNumberColor: "#0a0b14",
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: "13px",
  };
}

/** Renders `.mermaid` blocks with portfolio colors after mount. */
export default function MermaidBoot() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      const scheme = readScheme();

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        themeVariables: themeVariables(scheme),
        fontFamily: "IBM Plex Mono, ui-monospace, monospace",
        flowchart: {
          curve: "basis",
          htmlLabels: true,
          padding: 16,
          nodeSpacing: 36,
          rankSpacing: 48,
          diagramPadding: 12,
        },
        sequence: {
          mirrorActors: false,
          actorMargin: 28,
          messageMargin: 36,
          boxMargin: 12,
          useMaxWidth: true,
        },
        themeCSS: `
          .node rect, .node polygon, .node circle, .node path {
            stroke-width: 1.25px !important;
          }
          .nodeLabel, .edgeLabel, .label, .actor, .messageText, .loopText, .noteText {
            font-family: IBM Plex Mono, ui-monospace, monospace !important;
          }
          .cluster-label .nodeLabel, .cluster span {
            font-family: Space Grotesk, Manrope, sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: 0.02em;
          }
          .edgeLabel rect {
            opacity: 0.92;
          }
        `,
      });

      const nodes = document.querySelectorAll<HTMLElement>("pre.mermaid");
      if (!nodes.length) return;

      try {
        await mermaid.run({ nodes });
      } catch (err) {
        console.warn("[mermaid] render failed", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
