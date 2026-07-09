"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import SwitchingPanel from "@/components/prototype/switching-panel";
import { DOCS } from "@/lib/prototype-data";

type CommSectionProps = {
  revealed: boolean;
  activeDoc: number;
  pickDoc: (i: number) => void;
};

function CommSection({ revealed, activeDoc, pickDoc }: CommSectionProps) {
  return (
    <section className="pt-section" id="comm">
      <div className="pt-section-num">04</div>
      <Reveal id="comm" visible={revealed} sectionId="comm">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">How I communicate</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            The artifacts that move a project.
          </h2>
          <p className="pt-body" style={{ maxWidth: "66ch", margin: "14px auto 0" }}>
            Decks for the boardroom, specs for engineering, runbooks for go-live. Pick one to preview.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginTop: 30, textAlign: "left" }}>
            {DOCS.map((d, i) => (
              <button
                key={d.name}
                type="button"
                className={`pt-tab pt-hover-lift ${i === activeDoc ? "pt-tab--active" : ""}`}
                style={{ textAlign: "left", padding: "14px 16px", width: "100%" }}
                onClick={() => pickDoc(i)}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: i === activeDoc ? "var(--accent)" : "var(--ink3)" }}>
                  {d.name}
                </div>
                <div style={{ marginTop: 9, fontFamily: "var(--font-display)", fontSize: "13.5px", fontWeight: 600, color: "var(--ink)" }}>
                  {d.title}
                </div>
                <div style={{ marginTop: 3, fontSize: 11, color: "var(--ink3)" }}>{d.kind}</div>
              </button>
            ))}
          </div>
          <SwitchingPanel
            index={activeDoc}
            total={DOCS.length}
            style={{ marginTop: 22 }}
            render={(docIndex) => {
              const doc = DOCS[docIndex];
              return (
                <div style={{ border: "1px solid var(--line2)", borderRadius: 16, overflow: "hidden", background: "var(--bg2)", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: "1px solid var(--line)" }}>
                    {[0, 1, 2].map((n) => (
                      <span key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--line2)", display: "inline-block" }} />
                    ))}
                    <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--ink3)" }}>
                      {doc.file}
                    </span>
                  </div>
                  <div style={{ padding: "24px clamp(18px,3vw,32px) 32px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>{doc.title}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginTop: 4, letterSpacing: "0.05em" }}>
                      {doc.sub}
                    </div>
                    <div className="pt-switch-stagger" style={{ marginTop: 22 }}>
                      {doc.docKind === "deck" &&
                        doc.slides?.map((sl) => (
                          <div key={sl.n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 16, marginBottom: 8, background: "var(--bg3)" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", minWidth: 20 }}>{sl.n}</span>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{sl.t}</span>
                          </div>
                        ))}
                      {doc.docKind === "flow" && (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {doc.boxes?.map((b) => (
                            <div key={b} style={{ flex: 1, minWidth: 140, border: "1px solid var(--line)", borderRadius: 16, padding: "14px 16px", background: "var(--bg3)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink)" }}>
                              {b}
                            </div>
                          ))}
                        </div>
                      )}
                      {doc.docKind === "spec" && (
                        <>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {doc.lines?.map((ln) => (
                              <div key={ln} style={{ padding: "8px 12px", border: "1px solid var(--line)", borderRadius: 16, background: "var(--bg3)", fontSize: 13, color: "var(--ink2)" }}>
                                {ln}
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 16, border: "1px solid var(--line)", borderLeft: "2px solid var(--neon3)", borderRadius: 16, padding: "12px 14px 12px 16px", background: "var(--bg)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink2)", lineHeight: 1.75 }}>
                            {doc.code?.map((cl) => (
                              <div key={cl}>{cl}</div>
                            ))}
                          </div>
                        </>
                      )}
                      {doc.docKind === "runbook" &&
                        doc.steps?.map((st) => (
                          <div key={st.num} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", minWidth: 22 }}>{st.num}</span>
                            <span style={{ fontSize: 14, color: "var(--ink2)" }}>{st.label}</span>
                          </div>
                        ))}
                      {doc.docKind === "trace" && (
                        <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
                          {doc.rows?.map((r) => (
                            <div key={r.a} style={{ display: "flex", gap: 0, padding: "10px 14px", borderBottom: "1px solid var(--line)" }}>
                              <div style={{ flex: 1, fontSize: 13, color: "var(--ink)" }}>{r.a}</div>
                              <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--neon1)", textShadow: "0 0 8px color-mix(in srgb, var(--neon1) 35%, transparent)" }}>
                                {r.b}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {doc.docKind === "playbook" &&
                        doc.phases?.map((ph) => (
                          <div key={ph.p} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", minWidth: 84 }}>{ph.p}</span>
                            <span style={{ fontSize: "12.5px", color: "var(--ink3)" }}>{ph.nLabel}</span>
                          </div>
                        ))}
                    </div>
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

export default memo(CommSection);
