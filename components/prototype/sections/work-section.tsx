"use client";

import { memo, useState } from "react";
import Reveal from "@/components/prototype/reveal";
import FlowRail from "@/components/prototype/flow-rail";
import SectionHead from "@/components/prototype/section-head";
import SwitchingPanel from "@/components/prototype/switching-panel";
import {
  CASES,
  INCIDENT_TRACE,
  INTEGRATION_FLOW,
  MANDI_COMMERCE_FLOW,
  PIKU_STACK_FLOW,
  RELIVE_LIFECYCLE_FLOW,
  VOICE_LAYER_FLOW,
} from "@/lib/prototype-data";

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
          <SectionHead
            kicker="Selected work"
            title="Salescode first. The rest by name."
            lede="Flagship is Coca-Cola on Salescode. ReliveCure and Mandi Bhai were transferred. PIKU is in progress. Screens are only files already in this repo."
          />

          <SwitchingPanel
            index={activeCase}
            total={CASES.length}
            className="pt-work-panel"
            render={(caseIndex) => <CasePanel index={caseIndex} />}
          />

          <div data-work-tabs className="pt-work-picks" role="tablist" aria-label="Switch case study">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === activeCase}
                className={`pt-work-pick${c.flagship ? " pt-work-pick--flagship" : " pt-work-pick--sibling"}${
                  i === activeCase ? " pt-work-pick--active" : ""
                }`}
                onClick={() => pickCase(i)}
              >
                <span className="pt-work-pick__icon" aria-hidden>
                  {caseIcon(c.id)}
                </span>
                <span className="pt-work-pick__text">
                  <span className="pt-work-pick__kicker">
                    {c.numLabel} · {c.kicker.replace(/^Flagship ·\s*/i, "").split("·")[0]?.trim() ?? c.kicker}
                  </span>
                  <span className="pt-work-pick__title">{c.title}</span>
                  <span className="pt-work-pick__sub">{c.status}</span>
                </span>
                <span className="pt-work-pick__chev" aria-hidden>
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function caseIcon(id: string) {
  switch (id) {
    case "salescode":
      return "◆";
    case "relivecure":
      return "▣";
    case "piku":
      return "≡";
    case "mandibhai":
      return "⌂";
    default:
      return "·";
  }
}

function diagramFor(caseId: string) {
  const c = CASES.find((x) => x.id === caseId);
  if (!c?.diagram) return null;
  switch (c.diagram) {
    case "integration":
      return INTEGRATION_FLOW.map((s) => ({ label: s.label, sub: s.sub }));
    case "relive":
      return RELIVE_LIFECYCLE_FLOW;
    case "commerce":
      return MANDI_COMMERCE_FLOW;
    case "piku":
      return PIKU_STACK_FLOW;
    default:
      return null;
  }
}

function CasePanel({ index }: { index: number }) {
  const cd = CASES[index];
  const [shot, setShot] = useState(0);
  const current = cd.shots[shot] ?? null;
  const flow = diagramFor(cd.id);
  const rootClass = `pt-switch-stagger pt-work-stage pt-case${cd.flagship ? " pt-work-stage--hero pt-case--flagship" : " pt-work-stage--detail"}`;

  return (
    <div className={rootClass}>
      <div className="pt-case-copy">
        {cd.transferred ? (
          <p className="pt-transfer-notice" role="note">
            Transferred to their team. I do not operate this product now. No production URL on this page.
          </p>
        ) : null}
        <div className="pt-case-kicker">
          {cd.kicker}
          <em>{cd.status}</em>
        </div>
        <h3 className="pt-case-title">
          {cd.docHref ? (
            <a href={cd.docHref} className="pt-case-title-link">
              {cd.title}
            </a>
          ) : (
            cd.title
          )}
        </h3>

        <CaseBlock label="Context" text={cd.context} required />
        <CaseBlock label="Problem" text={cd.problem} required />
        <CaseBlock label="Role" text={cd.role} required />
        <CaseBlock label="Architecture" text={cd.architecture} required />

        {flow ? (
          <div className="pt-case-block">
            <div className="pt-lab-kicker">Flow</div>
            <FlowRail steps={flow} />
          </div>
        ) : null}

        {cd.showScaiLayer ? <ScaiLayer /> : null}

        {cd.diagram === "integration" ? (
          <div className="pt-case-block">
            <div className="pt-lab-kicker">Incident trace (example)</div>
            <p className="pt-case-muted">
              How a field sync failure is usually debugged on a rollout — illustrative pattern, not a customer ticket ID.
            </p>
            <FlowRail
              steps={INCIDENT_TRACE.map((s) => ({
                label: s.label,
                sub: s.sub,
                accent: s.kind === "root" || s.kind === "fixed",
              }))}
            />
          </div>
        ) : null}

        {cd.implementation.length ? (
          <div className="pt-case-block">
            <div className="pt-lab-kicker">Implementation</div>
            <ol className="pt-case-list">
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
          <p className="pt-case-outcome">{cd.outcome}</p>
        </div>

        {(cd.docHref || cd.githubHref) && (
          <div className="pt-lab-actions pt-case-actions">
            {cd.docHref ? (
              <a href={cd.docHref} className="pt-cta pt-cta--primary">
                Full case study
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

      <CaseShotColumn cd={cd} current={current} shot={shot} setShot={setShot} />
    </div>
  );
}

function CaseShotColumn({
  cd,
  current,
  shot,
  setShot,
}: {
  cd: (typeof CASES)[number];
  current: (typeof CASES)[number]["shots"][number] | null;
  shot: number;
  setShot: (n: number) => void;
}) {
  return (
    <div className="pt-case-visual">
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
          <p>No product screens — direction and architecture only until there is a shipped surface worth showing.</p>
        </div>
      )}
    </div>
  );
}

function ScaiLayer() {
  return (
    <div className="pt-case-block pt-scai-block">
      <div className="pt-lab-kicker">SCAI — application layer</div>
      <p className="pt-case-muted">
        Managed telephony, STT, TTS and LLM services on rent. Conversation design, RAG chunking, guardrails, qualification and
        writeback on own.
      </p>
      <div className="pt-scai-grid">
        {VOICE_LAYER_FLOW.map((step) => (
          <div key={step.label} className={`pt-scai-cell pt-scai-cell--${step.kind}`}>
            <span className="pt-scai-kind">{step.kind}</span>
            <strong>{step.label}</strong>
            <span>{step.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseBlock({ label, text, required }: { label: string; text: string; required?: boolean }) {
  if (!text && required) return null;
  if (!text) return null;
  return (
    <div className="pt-case-block">
      <div className="pt-lab-kicker">{label}</div>
      <p>{text}</p>
    </div>
  );
}

export default memo(WorkSection);