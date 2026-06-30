"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const APPS = [
  { id: "operate", label: "Operate", href: "/os/apps/operate/", desc: "Ambiguity → ship" },
  { id: "enterprise", label: "Enterprise", href: "/os/apps/enterprise/", desc: "Missions & scale" },
  { id: "piku", label: "PIKU", href: "/os/apps/piku/", desc: "Local-first OS" },
  { id: "relive", label: "Relive", href: "/os/apps/relive/", desc: "Production ops" },
  { id: "mitra", label: "Mitra", href: "/os/apps/mitra/", desc: "Enforcement" },
] as const;

export function AtlasShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/os/" className="font-mono text-sm text-muted hover:text-text transition-colors">
              Singh<span className="text-accent">OS</span>
            </Link>
            <nav className="hidden sm:flex gap-1">
              {APPS.map((app) => {
                const active = pathname.includes(app.id);
                return (
                  <Link
                    key={app.id}
                    href={app.href}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      active ? "bg-surface-2 text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {app.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Link href="/" className="text-sm text-muted hover:text-text transition-colors">
            ← Trust
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        Atlas · evidence from repositories · no secrets exposed
      </footer>
    </div>
  );
}

export function AppDock() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {APPS.map((app) => (
        <Link
          key={app.id}
          href={app.href}
          className="group glass rounded-xl p-6 transition-all duration-200 hover:border-accent/40 hover:shadow-[0_0_32px_-12px] hover:shadow-accent/20"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {app.id}.app
          </p>
          <h2 className="mt-2 text-xl font-medium group-hover:text-accent transition-colors">
            {app.label}
          </h2>
          <p className="mt-2 text-sm text-muted">{app.desc}</p>
        </Link>
      ))}
    </div>
  );
}
