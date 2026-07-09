"use client";

import { memo, useMemo } from "react";
import Reveal from "@/components/prototype/reveal";
import { PRINCIPLES } from "@/lib/prototype-data";

type MindSectionProps = {
  revealed: boolean;
};

function MindSection({ revealed }: MindSectionProps) {
  const loop = useMemo(() => [...PRINCIPLES, ...PRINCIPLES], []);
  const loopRev = useMemo(() => [...[...PRINCIPLES].reverse(), ...[...PRINCIPLES].reverse()], []);

  return (
    <section className="pt-section" id="mind">
      <div className="pt-section-num">05</div>
      <Reveal id="mind" visible={revealed} sectionId="mind">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker">Ways of thinking</span>
          <h2 className="pt-h2" style={{ maxWidth: "18ch" }}>
            The operating philosophy.
          </h2>
        </div>
        <div className="pt-marquee-mask">
          <div style={{ overflow: "hidden", width: "100%" }}>
            <div className="pt-marquee-track pt-marquee-track--left">
              {loop.map((pr, i) => (
                <span key={`${pr}-${i}`} className="pt-pill">
                  {pr}
                </span>
              ))}
            </div>
          </div>
          <div style={{ overflow: "hidden", width: "100%" }}>
            <div className="pt-marquee-track pt-marquee-track--right">
              {loopRev.map((pr, i) => (
                <span key={`${pr}-${i}`} className="pt-pill pt-pill--rev">
                  {pr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(MindSection);
