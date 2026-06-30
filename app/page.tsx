export default function TrustMode() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <section className="max-w-2xl space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">
            Jaskirat Singh
          </h1>
          <p className="text-text-muted text-lg">
            Systems thinker who ships in production environments.
          </p>
        </header>

        <div className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-widest text-text-muted">
            Operate
          </h2>
          <div className="flex gap-4 text-lg">
            <span>Map</span>
            <span className="text-text-muted">·</span>
            <span>Integrate</span>
            <span className="text-text-muted">·</span>
            <span>Harden</span>
            <span className="text-text-muted">·</span>
            <span>Operate</span>
            <span className="text-text-muted">·</span>
            <span>Iterate</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-widest text-text-muted">
            Proof
          </h2>
          <p className="text-text-muted">
            Salescode enterprise · Coca-Cola regions · Relive production
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-widest text-text-muted">
            Evidence
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-medium">Relive</h3>
              <p className="text-sm text-text-muted">Operate</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-medium">Mitra</h3>
              <p className="text-sm text-text-muted">Architect</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-medium">PIKU</h3>
              <p className="text-sm text-text-muted">Build forward</p>
            </div>
          </div>
        </div>

        <div>
          <a
            href="/os"
            className="inline-flex items-center gap-2 text-accent hover:underline transition-colors duration-200"
          >
            Enter Atlas →
          </a>
        </div>
      </section>
    </main>
  );
}
