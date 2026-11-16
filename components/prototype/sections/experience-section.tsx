"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { EXPERIENCE } from "@/lib/prototype-data";

type Props = { revealed: boolean };

function ExperienceSection({ revealed }: Props) {
  return (
    <section className="pt-section" id="experience">
      <div className="pt-section-num">06</div>
      <Reveal id="experience" visible={revealed} sectionId="experience">
        <div className="pt-wrap">
          <span className="pt-kicker">Experience</span>
          <h2 className="pt-h2" style={{ maxWidth: "16ch" }}>
            Two jobs. Real titles.
          </h2>
          <div className="pt-exp-list">
            {EXPERIENCE.map((job) => (
              <article key={job.org} className={`pt-exp-card ${job.now ? "pt-exp-card--now" : ""}`} data-ball-hover>
                <div className="pt-exp-meta">
                  <strong>{job.org}</strong>
                  <span>{job.dates}</span>
                </div>
                <h3>{job.title}</h3>
                <p>{job.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(ExperienceSection);
