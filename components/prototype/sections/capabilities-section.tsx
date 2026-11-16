"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { CAPABILITIES } from "@/lib/prototype-data";

type Props = { revealed: boolean };

function CapabilitiesSection({ revealed }: Props) {
  return (
    <section className="pt-section" id="capabilities">
      <div className="pt-section-num">03</div>
      <Reveal id="capabilities" visible={revealed} sectionId="capabilities">
        <div className="pt-wrap">
          <span className="pt-kicker">Capabilities</span>
          <h2 className="pt-h2" style={{ maxWidth: "20ch" }}>
            How work actually moves.
          </h2>
          <p className="pt-body" style={{ marginTop: 14, maxWidth: "64ch" }}>
            Not a stack list. The same motions, walked on Coca-Cola / Salescode: pipeline, mapping, insight, KPI, delivery.
          </p>
          <div className="pt-cap-grid">
            {CAPABILITIES.map((c, i) => (
              <article key={c.id} className="pt-cap-card" data-ball-hover>
                <span className="pt-lab-kicker">{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(CapabilitiesSection);
