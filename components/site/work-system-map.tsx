import Link from "next/link";

type MapNode = {
  slug: string;
  label: string;
  lane: "consult" | "operate" | "build" | "essay";
  hint: string;
};

const NODES: MapNode[] = [
  { slug: "salescode", label: "Salescode", lane: "consult", hint: "Enterprise lifecycle" },
  { slug: "relivecure", label: "ReliveCure", lane: "operate", hint: "Freelance · handed over" },
  { slug: "piku", label: "PIKU", lane: "build", hint: "Concept · local-first AI" },
  { slug: "mandibhai", label: "MandiBhai", lane: "build", hint: "Freelance · B2B ordering" },
];

const LINKS: { from: string; to: string; label: string }[] = [
  { from: "relivecure", to: "salescode", label: "ops discipline" },
  { from: "piku", to: "relivecure", label: "RAG / context" },
  { from: "mandibhai", to: "salescode", label: "ordering workflows" },
];

const LANE_META: Record<MapNode["lane"], { title: string; accent: string }> = {
  consult: { title: "Consult", accent: "var(--accent)" },
  essay: { title: "Essay", accent: "var(--accent3)" },
  operate: { title: "Operate", accent: "var(--accent2)" },
  build: { title: "Build", accent: "var(--neon1)" },
};

/** Portfolio-styled system map (not default Mermaid chrome). */
export default function WorkSystemMap() {
  return (
    <section className="work-map-block work-system-map" aria-label="Portfolio system map">
      <h2 className="work-map-heading">Portfolio system map</h2>
      <p className="work-system-map__lede">
        Forward Deployed / Solutions / AI Deployment — how the pieces connect.
      </p>

      <div className="work-system-map__hub">
        <span className="work-system-map__hub-kicker">Positioning</span>
        <strong>Forward Deployed · Solutions · AI Deployment</strong>
      </div>

      <div className="work-system-map__lanes">
        {(Object.keys(LANE_META) as MapNode["lane"][]).map((lane) => {
          const meta = LANE_META[lane];
          const items = NODES.filter((n) => n.lane === lane);
          if (!items.length) return null;
          return (
            <div key={lane} className="work-system-map__lane" style={{ ["--lane-accent" as string]: meta.accent }}>
              <h3>{meta.title}</h3>
              <ul>
                {items.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/work/${n.slug}`}>
                      <strong>{n.label}</strong>
                      <span>{n.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <ul className="work-system-map__links" aria-label="Cross-links">
        {LINKS.map((l) => (
          <li key={`${l.from}-${l.to}`}>
            <Link href={`/work/${l.from}`}>{NODES.find((n) => n.slug === l.from)?.label}</Link>
            <span className="work-system-map__arrow">→</span>
            <em>{l.label}</em>
            <span className="work-system-map__arrow">→</span>
            <Link href={`/work/${l.to}`}>{NODES.find((n) => n.slug === l.to)?.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
