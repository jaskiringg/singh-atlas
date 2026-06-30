export default function AtlasMode() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight">Atlas OS</h1>
          <p className="text-text-muted">
            Deep access to the operating model.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {apps.map((app) => (
            <div
              key={app.name}
              className="rounded-lg border border-white/10 p-6 space-y-2 hover:border-accent/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{app.name}</h2>
                <span className="text-xs font-mono text-text-muted">
                  {app.version}
                </span>
              </div>
              <p className="text-sm text-text-muted">{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const apps = [
  {
    name: "Operate.app",
    description: "Interactive operating model — ambiguity to ship",
    version: "v1",
  },
  {
    name: "Enterprise.app",
    description: "Missions map, capabilities, no secrets",
    version: "v1",
  },
  {
    name: "PIKU.app",
    description: "Product evidence — local-first OS experiment",
    version: "v1",
  },
  {
    name: "Relive.app",
    description: "Production war stories (sync, security, bot)",
    version: "v1",
  },
  {
    name: "Mitra.app",
    description: "Architecture purity — enforcement model",
    version: "v1",
  },
  {
    name: "Signal.app",
    description: "GitHub pulse from build-time JSON",
    version: "v1.1",
  },
  {
    name: "Brain.app",
    description: "Curated mind — 3–5 real entries only",
    version: "v1.1",
  },
];
