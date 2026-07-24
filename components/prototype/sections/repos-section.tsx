"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { REPOS, REPO_GROUP_NEON, GITHUB_USER } from "@/lib/prototype-data";

type ReposSectionProps = {
  revealed: boolean;
};

function ReposSection({ revealed }: ReposSectionProps) {
  return (
    <section className="pt-section" id="repos">
      <div className="pt-section-num">08</div>
      <Reveal id="repos" visible={revealed} sectionId="repos">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">Selected repositories</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            A few worth actually opening.
          </h2>
          <p className="pt-body" style={{ margin: "14px auto 0" }}>
            Click a card for the case study / design doc. GitHub is the public showcase repo —
            not a rebuild kit.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14, marginTop: 30, textAlign: "left" }}>
            {REPOS.map((r) => {
              const gc = REPO_GROUP_NEON[r.group] || "var(--accent)";
              const primaryHref = r.docHref ?? (r.githubRepo ? `https://github.com/${GITHUB_USER}/${r.githubRepo}` : "#");
              const githubHref = r.githubRepo ? `https://github.com/${GITHUB_USER}/${r.githubRepo}` : null;
              return (
                <div
                  key={r.name}
                  data-ball-hover
                  className="pt-hover-lift"
                  style={{
                    gridColumn: r.featured ? "span 2" : "span 1",
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    padding: 22,
                    background: "var(--bg2)",
                    display: "flex",
                    flexDirection: "column",
                    color: "inherit",
                  }}
                >
                  <a href={primaryHref} style={{ textDecoration: "none", color: "inherit", display: "block", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink)" }}>{r.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: gc, textShadow: `0 0 8px color-mix(in srgb, ${gc} 55%, transparent)` }}>
                        {r.group}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--ink2)", marginTop: 14, lineHeight: 1.5 }}>{r.purpose}</p>
                    <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 14 }}>
                      <b style={{ color: "var(--ink2)", fontWeight: 500 }}>Shows:</b> {r.shows}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)", marginTop: 12 }}>{r.stack}</div>
                  </a>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {r.docHref ? (
                      <a
                        href={r.docHref}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--bg)",
                          background: "var(--accent)",
                          padding: "7px 12px",
                          borderRadius: 8,
                          textDecoration: "none",
                        }}
                      >
                        Docs
                      </a>
                    ) : null}
                    {githubHref ? (
                      <a
                        href={githubHref}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--ink2)",
                          border: "1px solid var(--line2)",
                          padding: "7px 12px",
                          borderRadius: 8,
                          textDecoration: "none",
                        }}
                      >
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(ReposSection);
