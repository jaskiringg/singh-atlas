"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a metric value from 0 to its final number when scrolled into view.
 * Accepts the raw display string (e.g. "8,800", "100+", "3", "Live", "E2E") —
 * non-numeric or mixed strings render as-is immediately (no count-up possible).
 * Respects prefers-reduced-motion by snapping straight to the final value.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return reduced ? value : zeroed(value);
  });
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const parsed = parseNumeric(value);
    if (!parsed) {
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (started.current) return;
        if (entries.some((e) => e.isIntersecting)) {
          started.current = true;
          animate(parsed, setDisplay);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span className="count-up" ref={ref}>
      {display}
    </span>
  );
}

function zeroed(value: string): string {
  const parsed = parseNumeric(value);
  if (!parsed) return value;
  return format(0, parsed);
}

type Parsed = { num: number; prefix: string; suffix: string; hasComma: boolean };

function parseNumeric(value: string): Parsed | null {
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const num = parseInt(digits.replace(/,/g, ""), 10);
  if (Number.isNaN(num)) return null;
  return { num, prefix, suffix, hasComma: digits.includes(",") };
}

function format(n: number, parsed: Parsed): string {
  const rounded = Math.round(n);
  const digits = parsed.hasComma ? rounded.toLocaleString("en-US") : String(rounded);
  return `${parsed.prefix}${digits}${parsed.suffix}`;
}

function animate(parsed: Parsed, setDisplay: (s: string) => void) {
  const duration = 1100;
  const start = performance.now();

  function tick(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    setDisplay(format(parsed.num * eased, parsed));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
