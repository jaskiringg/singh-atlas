"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { AI_EXAMPLES, AI_FLOW } from "@/lib/prototype-data";

type AiSectionProps = {
  revealed: boolean;
};

function AiSection({ revealed }: AiSectionProps) {
  return (
    <section className="pt-section" id="ai">
      <div className="pt-section-num">03</div>
      <Reveal id="ai" visible={revealed} sectionId="ai">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">AI in delivery</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            I use AI to move faster, not to think for me.
          </h2>
          <p className="pt-body" style={{ maxWidth: "60ch", margin: "14px auto 0" }}>
            Requirement breakdowns, architecture docs, SQL drafts, payload debugging. AI clears the repetitive work
            so I spend time on the actual problem.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 14,
              marginTop: 32,
              textAlign: "left",
            }}
          >
            {AI_EXAMPLES.map((ex) => (
              <div key={ex} className="pt-hover-lift" style={{ border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px", background: "var(--bg2)", fontSize: "14.5px", color: "var(--ink2)", lineHeight: 1.55 }}>
                <span style={{ color: "var(--accent)" }}>↳ </span>
                {ex}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 44 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              {AI_FLOW.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ border: "1px solid var(--line2)", padding: "10px 16px", borderRadius: 16, background: "var(--bg2)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink)", whiteSpace: "nowrap" }}>
                    {label}
                  </div>
                  {i < AI_FLOW.length - 1 && (
                    <span style={{ padding: "0 8px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>→</span>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-flow-line">
              <div className="pt-flow-dot" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(AiSection);
