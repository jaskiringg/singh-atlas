import Link from "next/link";
import { getEvidence } from "@/lib/evidence";
import { ButtonLink, SectionLabel } from "@/components/ui";

export default function TrustPage() {
  const { identity, operateVerbs, proofPoints, repos } = getEvidence();
  const featured = ["relive-cure-backend", "mitra-friend-only-messaging", "piku"]
    .map((slug) => repos.find((r) => r.slug === slug))
    .filter(Boolean);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="atlas-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <header className="fade-in space-y-6">
          <SectionLabel>Trust Mode</SectionLabel>
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            {identity.name}
          </h1>
          <p className="max-w-xl text-lg text-muted leading-relaxed">
            {identity.tagline}
          </p>
        </header>

        <section className="fade-in mt-14 space-y-4" style={{ animationDelay: "80ms" }}>
          <SectionLabel>Operate</SectionLabel>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-2xl font-light tracking-tight sm:text-3xl">
            {operateVerbs.map((verb, i) => (
              <span key={verb}>
                {verb}
                {i < operateVerbs.length - 1 && (
                  <span className="ml-6 text-border">·</span>
                )}
              </span>
            ))}
          </div>
        </section>

        <section className="fade-in mt-14 space-y-5" style={{ animationDelay: "160ms" }}>
          <SectionLabel>Proof</SectionLabel>
          <ul className="space-y-4">
            {proofPoints.map((p) => (
              <li key={p.label} className="border-l-2 border-accent/50 pl-4">
                <span className="font-medium text-text">{p.label}</span>
                <span className="text-muted"> — {p.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="fade-in mt-14 space-y-5" style={{ animationDelay: "240ms" }}>
          <SectionLabel>Evidence</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((repo) => (
              <article
                key={repo!.slug}
                className="glass rounded-xl p-5 transition-colors duration-200 hover:border-accent/30"
              >
                <h3 className="font-medium">{repo!.name}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {repo!.signal.split("—")[0].trim()}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer
          className="fade-in mt-16 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "320ms" }}
        >
          <ButtonLink href="/os/">Enter Atlas →</ButtonLink>
          <div className="flex gap-4 text-sm text-muted">
            <a
              href="https://linkedin.com/in/jaskiratsingh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:hello@jaskiratsingh.com"
              className="hover:text-text transition-colors"
            >
              Email
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
