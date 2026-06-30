import { AppHeader, PatternCard } from "@/components/os/app-parts";
import { getEvidence, getPatternsByCategory } from "@/lib/evidence";

export default function EnterpriseAppPage() {
  const repos = getEvidence().repos.filter((r) => r.atlasApp === "enterprise");
  const patterns = getPatternsByCategory("enterprise");

  return (
    <>
      <AppHeader
        appId="enterprise"
        title="Enterprise missions"
        subtitle="Salescode platform work — Sellina integrations, multi-tenant agent design, lead scoring. Capabilities without confidential internals."
      />

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        <section className="glass rounded-xl p-8">
          <h2 className="text-lg font-medium">Mission context</h2>
          <p className="mt-4 text-muted leading-relaxed">
            Field sales systems across Coca-Cola regions — Thailand, Philippines, North India —
            connected through platform boundaries, not monolithic deployments. Same architecture,
            local constraints.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-6">Systems</h2>
          <div className="grid gap-4">
            {repos.map((repo) => (
              <article key={repo.slug} className="glass rounded-xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium">{repo.name}</h3>
                  <span className="font-mono text-[10px] uppercase text-muted">
                    {repo.visibility}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{repo.signal}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {repo.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[10px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-6">Enterprise patterns</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {patterns.map((p) => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
