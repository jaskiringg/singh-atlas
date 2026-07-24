import Link from "next/link";
import MermaidBoot from "@/components/site/mermaid-boot";
import { WORK_INDEX } from "@/lib/work-docs";

export const metadata = {
  title: "Work — Jaskirat Singh",
  description: "System map of case studies and engineering design docs.",
};

const PORTFOLIO_MAP = `flowchart TB
  subgraph role [Positioning]
    FDE[Forward Deployed / Solutions / AI Deployment]
  end

  subgraph consult [Enterprise consulting]
    SC[Salescode lifecycle]
    VA[Voice agent essay]
  end

  subgraph operate [Production ops]
    RC[ReliveCure clinic ops]
  end

  subgraph build [Product builds]
    PK[PIKU local-first AI]
    MB[MandiBhai B2B ordering]
  end

  FDE --> SC
  FDE --> VA
  FDE --> RC
  FDE --> PK
  FDE --> MB

  SC -.->|app-layer voice support| VA
  RC -.->|designed voice + WhatsApp AI| VA
  RC -.->|ops discipline| SC
  PK -.->|context / RAG thinking| VA
  MB -.->|ordering workflows| SC`;

export default function WorkIndexPage() {
  return (
    <main className="work-page">
      <MermaidBoot />
      <header className="work-header">
        <Link href="/" className="work-back">
          ← Home
        </Link>
        <p className="work-kicker">Case studies · design docs · maps</p>
        <h1 className="work-title">Selected work</h1>
        <p className="work-note">
          One map of how the pieces fit. Each node opens a deep write-up with architecture diagrams,
          workflows, and Download / GitHub links.
        </p>
      </header>

      <section className="work-map-block">
        <h2 className="work-map-heading">Portfolio system map</h2>
        <pre className="mermaid">{PORTFOLIO_MAP}</pre>
      </section>

      <section className="work-lanes">
        {(
          [
            { id: "consult", label: "Consult", items: WORK_INDEX.filter((w) => w.lane === "consult" || w.lane === "essay") },
            { id: "operate", label: "Operate", items: WORK_INDEX.filter((w) => w.lane === "operate") },
            { id: "build", label: "Build", items: WORK_INDEX.filter((w) => w.lane === "build") },
          ] as const
        ).map((lane) => (
          <div key={lane.id} className="work-lane">
            <h3>{lane.label}</h3>
            <ul>
              {lane.items.map((w) => (
                <li key={w.slug}>
                  <Link href={`/work/${w.slug}`}>
                    <strong>{w.title}</strong>
                    <span>{w.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
