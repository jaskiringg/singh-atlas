"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

/**
 * Mouse-move parallax tilt wrapper. Small rotation, resets on leave.
 * Disabled under reduced motion / touch (no pointer:fine) via a JS check on the event itself —
 * simplest reliable guard is just to ignore touch events, and reduced-motion users still get the
 * base non-transformed element since we only ever add a transform on mousemove.
 */
export function TiltCard({
  children,
  className,
  dataTheme,
}: {
  children: ReactNode;
  className?: string;
  dataTheme?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const max = 4;
    el.style.transform = `perspective(600px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={className}
      data-theme={dataTheme}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: "transform .25s ease-out" }}
    >
      {children}
    </div>
  );
}
