import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkDoc, listWorkSlugs, WORK_INDEX, type WorkSlug } from "@/lib/work-docs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = getWorkDoc(slug);
  if (!doc) return { title: "Work" };
  return {
    title: `${doc.meta.title} — Jaskirat Singh`,
    description: doc.meta.kicker,
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const doc = getWorkDoc(slug);
  if (!doc) notFound();

  const { meta, html } = doc;
  const others = WORK_INDEX.filter((w) => w.slug !== (slug as WorkSlug));

  return (
    <main className="work-page">
      <header className="work-header">
        <Link href="/#work" className="work-back">
          ← Work
        </Link>
        <p className="work-kicker">{meta.kicker}</p>
        <h1 className="work-title">{meta.title}</h1>
        <div className="work-actions">
          <a className="work-btn work-btn--primary" href={meta.download} download>
            Download
          </a>
          {meta.github ? (
            <a className="work-btn" href={meta.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          {meta.live ? (
            <a className="work-btn" href={meta.live} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
        </div>
        <p className="work-note">
          Engineering write-up — anti-clone redacted. Behavior and decisions, not a rebuild kit.
        </p>
      </header>

      <article className="work-prose" dangerouslySetInnerHTML={{ __html: html }} />

      <nav className="work-more">
        <h2>More write-ups</h2>
        <ul>
          {others.map((w) => (
            <li key={w.slug}>
              <Link href={`/work/${w.slug}`}>
                <strong>{w.title}</strong>
                <span>{w.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
