"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import SwitchingPanel from "@/components/prototype/switching-panel";
import { CASES } from "@/lib/prototype-data";

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
            Case studies with Docs / GitHub / Live — click a title to switch.{" "}
            <a href="/work" style={{ color: "var(--accent)" }}>
              Full system map →
            </a>
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
                      {cd.docHref ? (
                        <a href={cd.docHref} style={{ color: "inherit", textDecoration: "none" }}>
                          {cd.title}
                        </a>
                      ) : (
                        cd.title
                      )}
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
                    {(cd.docHref || cd.githubHref || cd.liveHref) && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                        {cd.docHref ? (
                          <a
                            href={cd.docHref}
                            className="pt-hover-lift"
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
                        {cd.githubHref ? (
                          <a
                            href={cd.githubHref}
                            target="_blank"
                            rel="noreferrer"
                            className="pt-hover-lift"
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
                        {cd.liveHref ? (
                          <a
                            href={cd.liveHref}
                            target="_blank"
                            rel="noreferrer"
                            className="pt-hover-lift"
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
                            Live
                          </a>
                        ) : null}
                        {cd.docHref ? (
                          <a
                            href={`/docs/${cd.id === "relivecure" ? "relivecure" : cd.id === "voice-agent" ? "voice-agent" : cd.id}.md`}
                            download
                            className="pt-hover-lift"
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
                            Download
                          </a>
                        ) : null}
                      </div>
                    )}
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
