"use client";

import { useEffect, useState } from "react";
import { quoteFor } from "@/lib/site-content";
import type { CaseStudy } from "@/lib/site-content";
import { Frame } from "./frame";
import { ArchDiagram } from "./arch-diagram";
import { IncidentTrace } from "./incident-trace";
import { PullQuote } from "./pull-quote";

const AUTO_MS = 5000;

/**
 * Selected work as tabs, not a triple-stacked scroll — click a case, see it.
 * The integration and incident cases pair with their diagram instead of repeating the story twice.
 * Auto-rotates through cases so a static viewport notices there's more than one, and
 * permanently stops rotating the moment a visitor manually picks a tab.
 */
export function WorkTabs({ cases }: { cases: CaseStudy[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const c = cases[active];
  const inset = quoteFor(c.id);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % cases.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [auto, cases.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div>
      <div className="worktabs-bar" data-reveal="left">
        {cases.map((cs, i) => (
          <button
            key={cs.id}
            className={`worktab${i === active ? " on" : ""}`}
            onClick={() => pick(i)}
          >
            <span className="wt-i">{String(i + 1).padStart(2, "0")}</span>
            <span className="wt-t">{cs.title}</span>
            {i === active && auto && <span className="wt-auto" aria-hidden />}
          </button>
        ))}
      </div>

      <article className="case worktab-panel" key={c.id}>
        <div>
          <span className="case-kicker">{c.kicker}</span>
          <h3 className="case-title">{c.title}</h3>
          <p className="case-context">{c.context}</p>
          <ul className="didlist">
            {c.did.map((d) => <li key={d}>{d}</li>)}
          </ul>
          {inset && (
            <div className="inset-quote">
              <PullQuote text={inset} size="lg" />
            </div>
          )}
          <div className="outcome">
            <div className="k">Outcome</div>
            <div className="v">{c.outcome}</div>
          </div>
          <div className="case-tags">{c.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        </div>

        <div>
          {c.id === "integration" ? (
            <ArchDiagram />
          ) : c.id === "incident" ? (
            <IncidentTrace />
          ) : (
            <div className={`case-shot${c.id === "salescode" ? " case-shot--phone" : ""}`}><Frame label={c.shotLabel} url={c.shotUrl} src={c.shot} /></div>
          )}
        </div>
      </article>
    </div>
  );
}
