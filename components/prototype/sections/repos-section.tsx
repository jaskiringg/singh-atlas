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
            I&apos;ve got a lot more repos than this. These are the ones that show something.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14, marginTop: 30, textAlign: "left" }}>
            {REPOS.map((r) => {
              const gc = REPO_GROUP_NEON[r.group] || "var(--accent)";
              return (
                <a
                  key={r.name}
                  data-ball-hover
                  href={`https://github.com/${GITHUB_USER}/${r.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pt-hover-lift"
                  style={{
                    gridColumn: r.featured ? "span 2" : "span 1",
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    padding: 22,
                    background: "var(--bg2)",
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
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
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(ReposSection);
