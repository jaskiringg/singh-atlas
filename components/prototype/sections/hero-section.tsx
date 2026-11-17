"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { PERSONAS, RECRUITER_BULLETS } from "@/lib/prototype-data";

type HeroSectionProps = {
  revealed: boolean;
  personaTick: number;
};

function HeroSection({ revealed, personaTick }: HeroSectionProps) {
  return (
    <header className="pt-hero" id="overview">
      <Reveal id="overview" visible={revealed} sectionId="overview">
        <div style={{ position: "relative" }}>
          <div className="pt-hero-blob" />
          <div className="pt-wrap pt-center">
            <span
              data-hero-block
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span className="pt-live-dot" />
              Jaskirat Singh · Consultant, Systems Builder &amp; Forward-Deployed Engineer — Gurugram
            </span>
            <h1 className="pt-hero-h1" data-hero-block>
              I don&apos;t ask how to build it.
              <br />
              I ask <span className="pt-hero-accent">how it should work.</span>
            </h1>
            <p
              data-hero-block
              style={{
                fontSize: "18.5px",
                lineHeight: 1.62,
                color: "var(--ink2)",
                maxWidth: "64ch",
                margin: "22px auto 0",
              }}
            >
              I sit between the customer&apos;s operations and the platform — mapping how data should move, how it should
              be validated, and how the business should run on it. Then I stay through SIT, UAT and go-live until it
              does.
            </p>

            <div data-hero-block className="pt-hero-ctas">
              <a href="#work" className="pt-cta pt-cta--primary">
                Explore selected work
              </a>
              <a href="#capabilities" className="pt-cta">
                Explore capabilities
              </a>
            </div>

            <div
              data-hero-block
              data-persona-grid
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,minmax(180px,1fr))",
                gap: 12,
                margin: "34px auto 0",
                maxWidth: 780,
              }}
            >
              {PERSONAS.map((p, i) => {
                const active = i === personaTick;
                return (
                  <div
                    key={p.key}
                    data-ball-hover
                    className="pt-hover-lift"
                    style={{
                      border: active ? `1px solid ${p.color}` : "1px solid var(--line)",
                      background: active ? "var(--bg3)" : "var(--bg2)",
                      borderRadius: 16,
                      padding: "16px 16px 18px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: active ? p.color : "var(--ink3)",
                      }}
                    >
                      {p.label}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink2)", lineHeight: 1.5 }}>
                      {p.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
              <div className="pt-recruiter-card" data-hero-block>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  Recruiter quick-read
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 15,
                    marginTop: 8,
                    lineHeight: 1.4,
                  }}
                >
                  Salescode.ai — Coca-Cola implementations, then the application layer of SCAI
                </div>
                <div style={{ height: 1, background: "var(--line)", margin: "14px 0" }} />
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {RECRUITER_BULLETS.map((b) => (
                    <li
                      key={b}
                      style={{
                        position: "relative",
                        paddingLeft: 14,
                        fontSize: 12,
                        color: "var(--ink2)",
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 5,
                          width: 5,
                          height: 5,
                          background: "var(--accent)",
                          transform: "rotate(45deg)",
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--ink3)" }}>
                  Gurugram, India — open to remote / onsite
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <div
        style={{
          position: "absolute",
          left: "clamp(20px,5vw,56px)",
          bottom: 26,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
          color: "var(--ink3)",
          display: "flex",
          gap: 9,
          alignItems: "center",
        }}
      >
        <span style={{ width: 1, height: 24, background: "linear-gradient(var(--ink3),transparent)" }} />
        SCROLL
      </div>
    </header>
  );
}

export default memo(HeroSection);
