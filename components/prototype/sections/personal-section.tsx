"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { BUILDS, METRICS, INTERESTS } from "@/lib/prototype-data";

type PersonalSectionProps = {
  revealed: boolean;
  metricsVals: string[] | null;
};

function PersonalSection({ revealed, metricsVals }: PersonalSectionProps) {
  return (
    <section className="pt-section" id="personal">
      <div className="pt-section-num">06</div>
      <Reveal id="personal" visible={revealed} sectionId="personal">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">Off the clock</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            I build the systems I wish existed.
          </h2>
          <p className="pt-body" data-hero-block style={{ maxWidth: "66ch", margin: "14px auto 0" }}>
            Each one started as a specific itch, and I kept going until it covered the whole use case — not a
            side-project sketch.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 34, textAlign: "left" }}>
            {BUILDS.map((b, i) => {
              const live = b.status === "Live";
              return (
                <article
                  key={b.name}
                  data-ball-hover
                  className="pt-hover-lift"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                    gap: 26,
                    alignItems: "center",
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    padding: 26,
                    background: "var(--bg2)",
                  }}
                >
                  <div
                    style={{
                      order: i % 2 === 1 ? 2 : 1,
                      display: "grid",
                      gridTemplateColumns: b.shots.length > 1 ? "repeat(2,1fr)" : "1fr",
                      gap: 10,
                    }}
                  >
                    {b.shots.map((sh) => (
                      <div key={sh.label} style={{ border: "1px solid var(--line2)", borderRadius: 16, overflow: "hidden" }}>
                        <div
                          style={{
                            backgroundImage: `url(${sh.src})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundColor: "var(--bg3)",
                            backgroundPosition: "center",
                            width: "100%",
                            aspectRatio: "16/11",
                          }}
                        />
                        <div style={{ padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink3)", borderTop: "1px solid var(--line)" }}>
                          {sh.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>
                      {b.docHref ? (
                        <a href={b.docHref} style={{ color: "inherit", textDecoration: "none" }}>
                          {b.name}
                        </a>
                      ) : (
                        b.name
                      )}{" "}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 400,
                          color: live ? "var(--neon1)" : "var(--accent)",
                          textShadow: live ? "0 0 10px color-mix(in srgb, var(--neon1) 60%, transparent)" : "none",
                        }}
                      >
                        · {b.status}
                      </span>
                    </h4>
                    <p style={{ fontSize: "14.5px", color: "var(--ink2)", marginTop: 10, lineHeight: 1.6 }}>{b.body}</p>
                    {(b.docHref || b.githubHref) && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                        {b.docHref ? (
                          <a
                            href={b.docHref}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 12,
                              color: "var(--bg)",
                              background: "var(--accent)",
                              padding: "9px 14px",
                              borderRadius: 8,
                              textDecoration: "none",
                            }}
                          >
                            Docs
                          </a>
                        ) : null}
                        {b.githubHref ? (
                          <a
                            href={b.githubHref}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 12,
                              color: "var(--ink2)",
                              border: "1px solid var(--line2)",
                              padding: "9px 14px",
                              borderRadius: 8,
                              textDecoration: "none",
                            }}
                          >
                            GitHub
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginTop: 40 }}>
            {METRICS.map((m, i) => (
              <div key={m.l} style={{ border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px", background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--accent)", textShadow: "0 0 14px color-mix(in srgb, var(--neon4) 40%, transparent)" }}>
                  {metricsVals ? metricsVals[i] : "0"}
                </div>
                <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)" }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "var(--ink3)", marginTop: 26 }}>What I love learning:</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 12 }}>
            {INTERESTS.map((label) => (
              <span
                key={label}
                className="pt-hover-lift"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink2)",
                  border: "1px solid var(--line2)",
                  padding: "6px 12px",
                  borderRadius: 16,
                  display: "inline-block",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(PersonalSection);
