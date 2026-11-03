import Link from "next/link";
import WorkSystemMap from "@/components/site/work-system-map";
import { WORK_INDEX } from "@/lib/work-docs";

export const metadata = {
  title: "Work — Jaskirat Singh",
  description: "System map of case studies and engineering design docs.",
};

export default function WorkIndexPage() {
  return (
    <main className="work-page">
      <div className="work-page__glow work-page__glow--a" aria-hidden />
      <div className="work-page__glow work-page__glow--b" aria-hidden />
      <div className="work-page__grid" aria-hidden />
      <header className="work-header">
        <Link href="/" className="work-back">
          ← Home
        </Link>
        <p className="work-kicker">Case studies · design docs · maps</p>
        <h1 className="work-title">Selected work</h1>
        <p className="work-note">
          One map of how the pieces fit. Each node opens the full case study.
        </p>
      </header>

      <WorkSystemMap />

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
                  {w.github ? (
                    <a className="work-lane-gh" href={w.github} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
