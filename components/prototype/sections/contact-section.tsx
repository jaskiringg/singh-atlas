"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { CONTACT_EMAIL } from "@/lib/contact";

type ContactSectionProps = {
  revealed: boolean;
};

function ContactSection({ revealed }: ContactSectionProps) {
  return (
    <section className="pt-section" id="contact" style={{ paddingBottom: "clamp(64px,10vh,96px)" }}>
      <Reveal id="contact" visible={revealed} sectionId="contact">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span className="pt-live-dot" />
            Contact
          </span>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,4.4vw,48px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "20ch",
              margin: "18px auto 0",
            }}
          >
            Already bought the platform. Need it to{" "}
            <span className="pt-hero-accent">actually run</span>?
          </p>
          <p className="pt-body" style={{ maxWidth: "60ch", margin: "20px auto 0", fontSize: 17 }}>
            Consulting, solutions, implementation, customer-success, delivery and forward-deployed roles. Gurugram —
            remote or onsite.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 28 }}>
            <a href={`mailto:${CONTACT_EMAIL}`} className="pt-contact-link">
              → email
            </a>
            <a href="https://www.linkedin.com/in/jaskiring" target="_blank" rel="noreferrer" className="pt-contact-link pt-contact-link--alt">
              → linkedin
            </a>
            <a href="https://github.com/jaskiringg" target="_blank" rel="noreferrer" className="pt-contact-link">
              → github
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(ContactSection);
