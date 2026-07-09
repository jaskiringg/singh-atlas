"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { TIMELINE } from "@/lib/prototype-data";

type PathSectionProps = {
  revealed: boolean;
};

function PathSection({ revealed }: PathSectionProps) {
  return (
    <section className="pt-section" id="path">
      <div className="pt-section-num">07</div>
      <Reveal id="path" visible={revealed} sectionId="path">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">Operating timeline</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            How I actually got here.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 12, marginTop: 32, textAlign: "left" }}>
            {TIMELINE.map((t) => (
              <div
                key={t.t}
                className="pt-hover-lift"
                style={{
                  border: t.isNow ? "1px solid var(--accent3)" : "1px solid var(--line)",
                  boxShadow: t.isNow
                    ? "0 0 0 1px color-mix(in srgb, var(--neon3) 25%, transparent), 0 0 16px -6px color-mix(in srgb, var(--neon3) 50%, transparent)"
                    : "none",
                  borderRadius: 16,
                  padding: "16px 18px",
                  background: t.isNow ? "color-mix(in srgb, var(--accent3) 7%, var(--bg2))" : "var(--bg2)",
                }}
              >
                <div style={{ display: "flex", gap: 16 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: t.isNow ? "1px solid var(--neon3)" : "1px solid var(--line2)",
                      background: "var(--bg)",
                      display: "grid",
                      placeItems: "center",
                      flex: "none",
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: t.isNow ? "var(--neon3)" : "var(--ink3)",
                        boxShadow: t.isNow ? "0 0 6px color-mix(in srgb, var(--neon3) 70%, transparent)" : "none",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{t.t}</div>
                    <div style={{ marginTop: 4, fontSize: "13.5px", color: "var(--ink2)", lineHeight: 1.55 }}>{t.d}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(PathSection);
