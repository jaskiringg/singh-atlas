"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { LIFECYCLE, PERSONAS } from "@/lib/prototype-data";

type ApproachSectionProps = {
  revealed: boolean;
  personaTick: number;
};

function ApproachSection({ revealed, personaTick }: ApproachSectionProps) {
  return (
    <section className="pt-section" id="approach">
      <div className="pt-section-num">01</div>
      <Reveal id="approach" visible={revealed} sectionId="approach">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">My approach</span>
          <h2 className="pt-h2" style={{ maxWidth: "18ch" }}>
            Same seat, start to finish.
          </h2>
          <p className="pt-body" style={{ maxWidth: "68ch", margin: "22px auto 0" }}>
            I get deep into the problem first. Only after that do I look for something existing that solves it —
            and I&apos;ll use it happily if it does. Most of the time it half-solves it, so I build the rest.
          </p>
          <p className="pt-body" style={{ maxWidth: "68ch", margin: "14px auto 0", color: "var(--ink)" }}>
            A discovery workshop and a SQL migration are the same project to me — I&apos;m in the room for both,
            and lately that includes the frontend too.
          </p>

          <div
            style={{
              margin: "38px auto 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 0,
              maxWidth: 720,
            }}
          >
            {PERSONAS.map((p, i) => {
              const active = i === personaTick;
              return (
                <div key={p.key} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      border: active ? `1px solid ${p.color}` : "1px solid var(--line2)",
                      background: active ? "var(--bg3)" : "var(--bg2)",
                      boxShadow: active ? `0 0 16px -6px ${p.color}` : "none",
                      borderRadius: 16,
                      padding: "12px 22px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: active ? p.color : "var(--ink2)",
                    }}
                  >
                    {p.label}
                  </div>
                  {i < PERSONAS.length - 1 && (
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink3)", padding: "0 12px", fontSize: 16 }}>
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px 24px",
              marginTop: 36,
            }}
          >
            {LIFECYCLE.map((phase, i) => (
              <span key={phase} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 14, color: "var(--ink2)" }}>{phase}</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(ApproachSection);
