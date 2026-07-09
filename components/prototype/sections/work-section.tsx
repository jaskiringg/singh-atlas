"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import SwitchingPanel from "@/components/prototype/switching-panel";
import { CASES, INTEGRATION_FLOW, INCIDENT_TRACE } from "@/lib/prototype-data";

type WorkSectionProps = {
  revealed: boolean;
  activeCase: number;
  pickCase: (i: number) => void;
};

function WorkSection({ revealed, activeCase, pickCase }: WorkSectionProps) {
  return (
    <section className="pt-section" id="work">
      <div className="pt-section-num">02</div>
      <Reveal id="work" visible={revealed} sectionId="work">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">Selected work</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            What that looks like in practice.
          </h2>
          <p className="pt-body" style={{ margin: "14px auto 0" }}>
            Three cases, one at a time — click a title to switch.
          </p>

          <div data-work-tabs style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 30 }}>
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`pt-tab pt-hover-lift ${i === activeCase ? "pt-tab--active" : ""}`}
                style={{ padding: "11px 18px", display: "inline-flex", alignItems: "center", gap: 10 }}
                onClick={() => pickCase(i)}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: i === activeCase ? "var(--accent)" : "var(--ink3)",
                  }}
                >
                  {c.numLabel}
                </span>
                <span style={{ fontSize: "13.5px", color: i === activeCase ? "var(--ink)" : "var(--ink2)" }}>
                  {c.title}
                </span>
              </button>
            ))}
          </div>

          <SwitchingPanel
            index={activeCase}
            total={CASES.length}
            style={{ marginTop: 34, textAlign: "left" }}
            render={(caseIndex) => {
              const cd = CASES[caseIndex];
              return (
                <div
                  className="pt-switch-stagger"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))",
                    gap: 40,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>
                      {cd.kicker}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px,2.6vw,30px)", margin: "10px 0 0" }}>
                      {cd.title}
                    </h3>
                    <p style={{ fontSize: "15.5px", color: "var(--ink2)", lineHeight: 1.62, marginTop: 14, maxWidth: "56ch" }}>
                      {cd.context}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
                      {cd.did.map((text, i) => (
                        <div
                          key={text}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "26px 1fr",
                            gap: 14,
                            padding: "12px 0",
                            borderBottom: "1px solid var(--line)",
                          }}
                        >
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div style={{ fontSize: "14.5px", color: "var(--ink2)", lineHeight: 1.55 }}>{text}</div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-outcome-box">
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>
                        Outcome
                      </div>
                      <div style={{ fontSize: "14.5px", color: "var(--ink)", lineHeight: 1.5 }}>{cd.outcome}</div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                      {cd.tags.map((tag) => (
                        <span
                          key={tag}
                          className="pt-hover-lift"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "var(--ink2)",
                            border: "1px solid var(--line2)",
                            padding: "5px 10px",
                            borderRadius: 16,
                            display: "inline-block",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {cd.shot && (
                      <div style={{ border: "1px solid var(--line2)", borderRadius: 16, overflow: "hidden", background: "var(--bg2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", borderBottom: "1px solid var(--line)" }}>
                          {[0, 1, 2].map((n) => (
                            <span key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--line2)", display: "inline-block" }} />
                          ))}
                          <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--ink3)" }}>
                            {cd.shotLabel}
                          </span>
                        </div>
                        <div
                          style={{
                            backgroundImage: `url(${cd.shot})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundColor: "var(--bg3)",
                            backgroundPosition: "center",
                            width: "100%",
                            aspectRatio: "16/10",
                          }}
                        />
                      </div>
                    )}
                    {cd.diagramType === "flow" && (
                      <div
                        style={{
                          border: "1px solid var(--line2)",
                          borderRadius: 18,
                          padding: "26px 24px",
                          background: "linear-gradient(165deg, var(--bg2), var(--bg))",
                          boxShadow: "0 24px 60px -28px color-mix(in srgb, var(--accent) 45%, transparent), inset 0 1px 0 color-mix(in srgb, var(--ink) 4%, transparent)",
                          transform: "perspective(900px) rotateX(1.5deg)",
                        }}
                      >
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)", marginBottom: 18 }}>
                          {cd.shotLabel}
                        </div>
                        {INTEGRATION_FLOW.map((node, i) => (
                          <div key={node.label}>
                            <div style={{ border: "1px solid var(--line2)", borderRadius: 16, padding: "12px 14px", background: "var(--bg3)", boxShadow: "0 8px 20px -12px rgba(0,0,0,.6)" }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12.5px", color: "var(--ink)" }}>{node.label}</div>
                              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 3 }}>{node.sub}</div>
                            </div>
                            {i < INTEGRATION_FLOW.length - 1 && (
                              <div style={{ position: "relative", width: 2, height: 26, background: "var(--line)", margin: "0 auto" }}>
                                <div className="pt-flow-dot-y" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {cd.diagramType === "trace" && (
                      <div
                        style={{
                          border: "1px solid var(--line2)",
                          borderRadius: 18,
                          padding: "26px 24px",
                          background: "linear-gradient(165deg, var(--bg2), var(--bg))",
                          boxShadow: "0 24px 60px -28px color-mix(in srgb, var(--accent3) 45%, transparent), inset 0 1px 0 color-mix(in srgb, var(--ink) 4%, transparent)",
                          transform: "perspective(900px) rotateX(1.5deg)",
                        }}
                      >
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)", marginBottom: 18 }}>
                          {cd.shotLabel}
                        </div>
                        {INCIDENT_TRACE.map((st, i) => {
                          const danger = st.kind === "fail" || st.kind === "root";
                          const fixed = st.kind === "fixed";
                          const dotColor = danger ? "var(--accent3)" : fixed ? "var(--accent2)" : "var(--line2)";
                          return (
                            <div key={st.label} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 14 }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div
                                  style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    border: `1.5px solid ${dotColor}`,
                                    background: "var(--bg)",
                                    display: "grid",
                                    placeItems: "center",
                                  }}
                                >
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor }} />
                                </div>
                                {i < INCIDENT_TRACE.length - 1 && (
                                  <div style={{ width: 1.5, flex: 1, minHeight: 20, background: "var(--line2)" }} />
                                )}
                              </div>
                              <div style={{ paddingBottom: 16 }}>
                                <div
                                  style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 600,
                                    fontSize: "13.5px",
                                    color: danger ? "var(--accent3)" : fixed ? "var(--accent2)" : "var(--ink)",
                                  }}
                                >
                                  {st.label}
                                </div>
                                <div style={{ fontSize: "12.5px", color: "var(--ink2)", marginTop: 3 }}>{st.sub}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

export default memo(WorkSection);
