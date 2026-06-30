import { SectionLabel } from "@/components/ui";
import type { Pattern } from "@/lib/types";

export function AppHeader({
  appId,
  title,
  subtitle,
}: {
  appId: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="border-b border-border bg-surface/50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <SectionLabel>{appId}.app</SectionLabel>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">{subtitle}</p>
      </div>
    </header>
  );
}

export function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <article className="glass rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-medium">{pattern.title}</h3>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent">
          {pattern.category}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted leading-relaxed">{pattern.description}</p>
      <p className="mt-3 font-mono text-[10px] text-muted/70">
        {pattern.evidence.join(" · ")}
      </p>
    </article>
  );
}

export function FlowStep({
  step,
  title,
  body,
  active,
}: {
  step: number;
  title: string;
  body: string;
  active?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border p-6 transition-colors ${
        active ? "border-accent/50 bg-accent/5" : "border-border glass"
      }`}
    >
      <span className="font-mono text-xs text-accent">0{step}</span>
      <h3 className="mt-2 font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
