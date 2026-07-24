"use client";

import { useEffect, useRef } from "react";

/** Renders any `.mermaid` blocks inside the work prose after mount. */
export default function MermaidBoot() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      const scheme =
        typeof document !== "undefined"
          ? document.documentElement.dataset.colorScheme
          : "dark";

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: scheme === "light" ? "neutral" : "dark",
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        flowchart: { curve: "basis", htmlLabels: true },
        sequence: { mirrorActors: false },
      });

      const nodes = document.querySelectorAll<HTMLElement>(".mermaid");
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
