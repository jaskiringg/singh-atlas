import Link from "next/link";
import { WORK_INDEX } from "@/lib/work-docs";

export const metadata = {
  title: "Work — Jaskirat Singh",
  description: "Case studies and engineering design docs.",
};

export default function WorkIndexPage() {
  return (
    <main className="work-page">
      <header className="work-header">
        <Link href="/" className="work-back">
          ← Home
        </Link>
        <p className="work-kicker">Case studies · design docs</p>
        <h1 className="work-title">Selected work</h1>
        <p className="work-note">
          Deep write-ups with Download + GitHub links. Interview-defensible; anti-clone redacted.
        </p>
      </header>
      <ul className="work-index-list">
        {WORK_INDEX.map((w) => (
          <li key={w.slug}>
            <Link href={`/work/${w.slug}`}>
              <strong>{w.title}</strong>
              <span>{w.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
