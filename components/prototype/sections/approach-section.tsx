"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { APPROACH_STEPS, AI_IN_WORKFLOW } from "@/lib/prototype-data";

type ApproachSectionProps = {
  revealed: boolean;
  personaTick: number;
};

function ApproachSection({ revealed }: ApproachSectionProps) {
  return (
    <section className="pt-section" id="approach">
      <div className="pt-section-num">05</div>
      <Reveal id="approach" visible={revealed} sectionId="approach">
        <div className="pt-wrap">
          <span className="pt-kicker">Approach</span>
          <h2 className="pt-h2" style={{ maxWidth: "18ch" }}>
            Same seat, eight steps.
          </h2>
          <p className="pt-body" style={{ marginTop: 14, maxWidth: "64ch" }}>
            Tied to a Salescode rollout. Workflow first, pipes second. I did not build the platform those pipes run on.
          </p>
          <ol className="pt-steps">
            {APPROACH_STEPS.map((s) => (
              <li key={s.n} className="pt-step" data-ball-hover>
                <span>{s.n}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="pt-ai-box">
            <span className="pt-kicker">AI in the workflow</span>
            <p className="pt-body" style={{ marginTop: 10, maxWidth: "62ch" }}>
              Daily leverage — documentation, payload diffs, SQL drafts, RAG structure — not a claim that I trained the model.
            </p>
            <ul>
              {AI_IN_WORKFLOW.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(ApproachSection);
