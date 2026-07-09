import { recruiterCard } from "@/lib/site-content";

/**
 * The 20-second version, as a physical artifact (business-card / ID-badge
 * feel) rather than another eyebrow+title+box scene. Anchored inside the
 * hero on desktop; stacks below the hero copy on mobile via CSS.
 */
export function RecruiterCard() {
  return (
    <div className="recruiter-card" data-reveal="right">
      <span className="rcard-kicker">Quick read</span>
      <div className="rcard-role">{recruiterCard.role}</div>

      <div className="rcard-divider" />

      <div className="rcard-label">Looking for</div>
      <div className="rcard-tags">
        {recruiterCard.lookingFor.map((t) => (
          <span className="rcard-tag" key={t}>{t}</span>
        ))}
      </div>

      <div className="rcard-divider" />

      <div className="rcard-label">Proof</div>
      <ul className="rcard-proof">
        {recruiterCard.proof.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <div className="rcard-based">{recruiterCard.basedIn}</div>
    </div>
  );
}
