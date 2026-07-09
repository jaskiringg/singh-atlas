import { deckSlides } from "@/lib/site-content";

/** Animated deck — slides reveal one by one on scroll. Demonstrates the consulting story arc. */
export function Deck() {
  return (
    <div className="deck" data-reveal>
      {deckSlides.map((s, i) => (
        <div className="slide" key={s.t} style={{ ["--d" as string]: i }}>
          <span className="sn">{String(i + 1).padStart(2, "0")}</span>
          <span className="st">{s.t}</span>
          <span className="sc">{s.c}</span>
        </div>
      ))}
    </div>
  );
}
