"use client";

import { memo, useState } from "react";
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
        <div className="pt-wrap">
          <span className="pt-kicker">Selected work</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            Salescode first. The rest by name.
          </h2>
          <p className="pt-body" style={{ margin: "14px 0 0", maxWidth: "64ch" }}>
            Flagship is Coca-Cola on Salescode. ReliveCure and Mandi Bhai were transferred. PIKU is in progress.
            Screens are only files already in this repo.
          </p>

          <div data-work-tabs className="pt-work-tabs">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`pt-tab pt-hover-lift ${i === activeCase ? "pt-tab--active" : ""}`}
                onClick={() => pickCase(i)}
              >
                <span className="pt-lab-tab-num">{c.numLabel}</span>
                {c.title}
              </button>
            ))}
          </div>

          <SwitchingPanel
            index={activeCase}
            total={CASES.length}
            style={{ marginTop: 34 }}
            render={(caseIndex) => <CasePanel index={caseIndex} />}
          />
        </div>
      </Reveal>
    </section>
  );
}

function CasePanel({ index }: { index: number }) {
  const cd = CASES[index];
  const [shot, setShot] = useState(0);
  const current = cd.shots[shot] ?? null;

  return (
    <div className="pt-switch-stagger pt-case">
      <div>
        <div className="pt-case-kicker">
          {cd.kicker}
          <em>{cd.status}</em>
        </div>
        <h3 className="pt-case-title">
          {cd.docHref ? (
            <a href={cd.docHref} style={{ color: "inherit", textDecoration: "none" }}>
              {cd.title}
            </a>
          ) : (
            cd.title
          )}
        </h3>
        {cd.context ? <CaseBlock label="Context" text={cd.context} /> : null}
        {cd.problem ? <CaseBlock label="Problem" text={cd.problem} /> : null}
        {cd.role ? <CaseBlock label="Role" text={cd.role} /> : null}
        {cd.architecture ? <CaseBlock label="Architecture" text={cd.architecture} /> : null}
        {cd.implementation.length ? (
          <div className="pt-case-block">
            <div className="pt-lab-kicker">Implementation</div>
            <ol>
              {cd.implementation.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ol>
          </div>
        ) : null}
        {cd.stack.length ? (
          <div className="pt-case-block">
            <div className="pt-lab-kicker">Stack</div>
            <div className="pt-tag-row">
              {cd.stack.map((tag) => (
                <span key={tag} className="pt-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="pt-outcome-box">
          <div className="pt-lab-kicker">Outcomes</div>
          <div style={{ fontSize: "14.5px", color: "var(--ink)", lineHeight: 1.5, marginTop: 6 }}>{cd.outcome}</div>
        </div>
        {(cd.docHref || cd.githubHref) && (
          <div className="pt-lab-actions" style={{ marginTop: 20 }}>
            {cd.docHref ? (
              <a href={cd.docHref} className="pt-cta pt-cta--primary">
                Case study
              </a>
            ) : null}
            {cd.githubHref ? (
              <a href={cd.githubHref} target="_blank" rel="noreferrer" className="pt-cta">
                GitHub
              </a>
            ) : null}
          </div>
        )}
      </div>

      <div>
        {current ? (
          <div className="pt-shot-frame">
            <div className="pt-shot-chrome">
              {[0, 1, 2].map((n) => (
                <span key={n} className="pt-shot-dot" />
              ))}
              <span>{current.label}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.label} className="pt-shot-img" />
            {cd.shots.length > 1 ? (
              <div className="pt-shot-thumbs">
                {cd.shots.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    className={i === shot ? "is-on" : ""}
                    onClick={() => setShot(i)}
                    aria-label={s.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="pt-shot-empty">
            <p className="pt-lab-kicker">{cd.shotLabel}</p>
            <p>No product screens — this one is still a design.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="pt-case-block">
      <div className="pt-lab-kicker">{label}</div>
      <p>{text}</p>
    </div>
  );
}

export default memo(WorkSection);
