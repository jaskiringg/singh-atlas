"use client";

import { memo } from "react";
import Reveal from "@/components/prototype/reveal";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/contact";

type ContactSectionProps = {
  revealed: boolean;
};

function ContactSection({ revealed }: ContactSectionProps) {
  return (
    <section className="pt-section" id="contact" style={{ paddingBottom: "clamp(64px,10vh,96px)" }}>
      <Reveal id="contact" visible={revealed} sectionId="contact">
        <div className="pt-wrap pt-center">
          <span className="pt-kicker" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
            Signal
          </span>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "20ch", margin: "18px auto 0" }}>
            Looking for someone to own an{" "}
            <span style={{ color: "var(--accent)", textShadow: "0 0 16px color-mix(in srgb, var(--neon4) 40%, transparent)" }}>
              entire system
            </span>
            ?
          </p>
          <p className="pt-body" style={{ maxWidth: "60ch", margin: "20px auto 0", fontSize: 17 }}>
            If you&apos;ve already got the platform and need someone to make it actually run — that&apos;s the call I
            want. Consulting, solutions, implementation, customer-success, delivery and forward-deployed roles.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 28 }}>
            <a href={`mailto:${CONTACT_EMAIL}`} className="pt-contact-link">
              → email
            </a>
            <a href={CONTACT_PHONE_TEL} className="pt-contact-link pt-contact-link--alt">
              → {CONTACT_PHONE}
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
