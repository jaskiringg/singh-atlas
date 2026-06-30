import { AppDock } from "@/components/os/shell";
import { getEvidence } from "@/lib/evidence";
import { SectionLabel } from "@/components/ui";

export default function OsHomePage() {
  const evidence = getEvidence();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <SectionLabel>Atlas Mode</SectionLabel>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
          {evidence.identity.thesis}
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          {evidence.patterns.length} patterns extracted from {evidence.repos.length} repositories.
          Depth rewards curiosity.
        </p>
      </div>

      <section className="mt-16">
        <SectionLabel className="mb-6 block">Applications</SectionLabel>
        <AppDock />
      </section>

      <section className="mt-20 grid gap-8 sm:grid-cols-3">
        {[
          { n: String(evidence.patterns.length), label: "Patterns" },
          { n: String(evidence.repos.length), label: "Repositories" },
          { n: "2", label: "Access modes" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-6 text-center">
            <p className="text-3xl font-light text-accent">{stat.n}</p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
