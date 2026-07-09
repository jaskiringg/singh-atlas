"use client";

import { useEffect, useRef, useState } from "react";

/** Incident trace — animated step-by-step debug narrative.
 *  Shows the incident as a timeline: symptom → investigation → root cause → fix.
 *  Each step reveals on scroll with a status indicator. */

const steps = [
  { id: "symptom", label: "Symptom", detail: "Field rep can't sync orders", status: "fail", time: "T+0" },
  { id: "gateway", label: "API timeout", detail: "Gateway returns 504", status: "warn", time: "T+2m" },
  { id: "kafka", label: "Consumer lag", detail: "Kafka partition backed up", status: "warn", time: "T+8m" },
  { id: "sql", label: "SQL mismatch", detail: "Stale product-master FK", status: "warn", time: "T+14m" },
  { id: "root", label: "Root cause", detail: "Delta sync dropped a master update", status: "root", time: "T+22m" },
  { id: "patch", label: "Patch + replay", detail: "Backfill events, re-consume", status: "fix", time: "T+28m" },
  { id: "resolved", label: "Production restored", detail: "Sync green, rep confirmed", status: "fixed", time: "T+34m" },
];

const statusStyles: Record<string, { color: string; bg: string; icon: string }> = {
  fail: { color: "var(--pipe-fail-stroke)", bg: "var(--pipe-fail-fill)", icon: "✕" },
  warn: { color: "var(--ink-2)", bg: "var(--bg-3)", icon: "↓" },
  root: { color: "var(--pipe-root-stroke)", bg: "var(--pipe-root-fill)", icon: "!" },
  fix: { color: "var(--pipe-fixed-stroke)", bg: "var(--pipe-fixed-fill)", icon: "↑" },
  fixed: { color: "var(--pipe-fixed-stroke)", bg: "var(--pipe-fixed-fill)", icon: "✓" },
};

export function IncidentTrace() {
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const stepId = e.target.getAttribute("data-step");
            if (stepId) {
              setVisibleSteps((prev) => new Set([...prev, stepId]));
            }
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.4 }
    );
    el.querySelectorAll("[data-step]").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className="incident-trace" ref={wrapRef}>
      {steps.map((step, i) => {
        const visible = visibleSteps.has(step.id);
        const s = statusStyles[step.status];
        return (
          <div
            key={step.id}
            className={`it-step${visible ? " visible" : ""}${activeStep === step.id ? " active" : ""}`}
            data-step={step.id}
            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="it-rail">
              <div className={`it-dot${i === 0 ? " first" : ""}${i === steps.length - 1 ? " last" : ""}`} style={{ borderColor: visible ? s.color : "var(--line-2)", background: visible ? s.bg : "var(--bg)" }}>
                <span className="it-icon" style={{ color: visible ? s.color : "var(--ink-3)" }}>{s.icon}</span>
              </div>
              {i < steps.length - 1 && <div className={`it-line${visible ? " visible" : ""}`} />}
            </div>
            <div className="it-body">
              <div className="it-top">
                <span className="it-time">{step.time}</span>
                <span className="it-label" style={{ color: visible ? s.color : "var(--ink-3)" }}>{step.label}</span>
              </div>
              <div className="it-detail">{step.detail}</div>
              {activeStep === step.id && step.status === "root" && (
                <div className="it-rootnote">
                  <span className="hl">Critical finding:</span> the delta-sync consumer silently dropped the product-master update because the FK constraint didn't retry. Not a code bug — a design gap.
                </div>
              )}
              {activeStep === step.id && step.status === "fixed" && (
                <div className="it-rootnote it-fixnote">
                  <span className="hl">Designed out:</span> added retry-with-backoff + dead-letter queue for master updates. The same failure mode can never recur silently.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
