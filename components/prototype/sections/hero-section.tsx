"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { PERSONAS, RECRUITER_BULLETS } from "@/lib/prototype-data";

type HeroSectionProps = {
  revealed: boolean;
  personaTick: number;
};

const ROTATION_RATES = [0.5, 0.6, 0.7];

function HeroSection({ revealed, personaTick }: HeroSectionProps) {
  return (
    <header className="pt-hero">
      <Reveal id="hero" visible={revealed} sectionId="hero">
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
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--neon1)",
                  boxShadow:
                    "0 0 8px color-mix(in srgb, var(--neon1) 85%, transparent), 0 0 16px color-mix(in srgb, var(--neon1) 40%, transparent)",
                }}
              />
              Jaskirat Singh · Consultant, Systems Builder &amp; Forward-Deployed Engineer — Gurugram, India
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
              Companies bring me in after they&apos;ve already bought the platform, when it&apos;s time to make it
              actually work — the workshops, the integration, the go-live, and the fix at 2am when it breaks.
              I&apos;ve done all four for the same account.
            </p>

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
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--neon2)",
                    boxShadow:
                      "0 0 0 3px color-mix(in srgb, var(--neon2) 20%, transparent), 0 0 6px color-mix(in srgb, var(--neon2) 60%, transparent)",
                  }}
                />
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
                  Consultant &amp; Systems Builder — discovery, implementation, integration, AI-assisted delivery
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
