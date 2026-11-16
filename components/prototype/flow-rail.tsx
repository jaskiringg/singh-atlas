"use client";

import { memo } from "react";

export type FlowStep = { label: string; sub?: string; accent?: boolean };

type FlowRailProps = {
  steps: FlowStep[];
  className?: string;
};

function FlowRail({ steps, className }: FlowRailProps) {
  return (
    <div className={`pt-flow-rail ${className ?? ""}`}>
      {steps.map((step, i) => (
        <div key={`${step.label}-${i}`} className="pt-flow-rail__item">
          <div className={`pt-flow-rail__node ${step.accent ? "pt-flow-rail__node--accent" : ""}`}>
            <strong>{step.label}</strong>
            {step.sub ? <span>{step.sub}</span> : null}
          </div>
          {i < steps.length - 1 ? <span className="pt-flow-rail__arrow" aria-hidden>→</span> : null}
        </div>
      ))}
    </div>
  );
}

export default memo(FlowRail);