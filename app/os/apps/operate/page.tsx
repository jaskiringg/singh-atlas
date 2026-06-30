import { AppHeader, FlowStep, PatternCard } from "@/components/os/app-parts";
import { getEvidence, getPatternsByCategory } from "@/lib/evidence";

const STEPS = [
  {
    title: "Map",
    body: "Document ambiguity. KPI mappings, GDD suites, founder runbooks. Know the system before touching it.",
  },
  {
    title: "Integrate",
    body: "Build boundary layers — API proxies, DB proxies, moderation hooks. Connect without coupling.",
  },
  {
    title: "Harden",
    body: "Security commits on live systems. Kill-switches, defensive sync, shadow mode for AI.",
  },
  {
    title: "Operate",
    body: "Operator routing, playbooks, sprint logs. Humans in the loop where it matters.",
  },
  {
    title: "Iterate",
    body: "Park what doesn't ship. Revert what drifts. Continuous commits over big-bang releases.",
  },
];

export default function OperateAppPage() {
  const patterns = getPatternsByCategory("operate");
  const verbs = getEvidence().operateVerbs;

  return (
    <>
      <AppHeader
        appId="operate"
        title="From ambiguity to shipped system"
        subtitle="The operating model behind Relive, LASIK, and every production commit. Not a methodology deck — extracted from how systems actually got built."
      />

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        <section>
          <div className="flex flex-wrap gap-3 mb-8">
            {verbs.map((v) => (
              <span
                key={v}
                className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
              >
                {v}
              </span>
            ))}
          </div>
          <div className="grid gap-4">
            {STEPS.map((s, i) => (
              <FlowStep
                key={s.title}
                step={i + 1}
                title={s.title}
                body={s.body}
                active={i === 0}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-6">Operate patterns from evidence</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {patterns.slice(0, 12).map((p) => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
