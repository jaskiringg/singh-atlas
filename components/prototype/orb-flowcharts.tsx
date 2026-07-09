import type { FlowchartId } from "@/lib/orb-extras";

const node = (x: number, y: number, w: number, label: string, sub?: string, accent?: string) => (
  <g key={`${x}-${y}-${label}`}>
    <rect
      x={x}
      y={y}
      width={w}
      height={sub ? 36 : 28}
      rx={8}
      fill="var(--bg3)"
      stroke={accent ?? "var(--line2)"}
      strokeWidth={1}
    />
    <text x={x + w / 2} y={y + (sub ? 14 : 17)} textAnchor="middle" fill="var(--ink)" fontSize={9} fontFamily="var(--font-mono)">
      {label}
    </text>
    {sub && (
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fill="var(--ink3)" fontSize={7.5} fontFamily="var(--font-body)">
        {sub}
      </text>
    )}
  </g>
);

function OverviewFlow() {
  const items = [
    ["Consultant", "discovery · alignment", "var(--neon1)"],
    ["Builder", "SQL · Kafka · APIs", "var(--neon2)"],
    ["Operator", "prod · incidents", "var(--neon3)"],
  ] as const;
  return (
    <svg viewBox="0 0 280 80" width="100%" style={{ maxWidth: 280, display: "block" }}>
      <defs>
        <marker id="orb-arr-o" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
        </marker>
      </defs>
      {items.map(([label, sub, color], i) => {
        const x = 4 + i * 92;
        return (
          <g key={label}>
            {i > 0 && <line x1={x - 8} y1={22} x2={x} y2={22} stroke="var(--accent)" strokeWidth={1.2} markerEnd="url(#orb-arr-o)" />}
            {node(x, 8, 84, label, sub, color)}
          </g>
        );
      })}
    </svg>
  );
}

function CareerFlow() {
  const items = [
    ["CAW Studios", "SDET"],
    ["Salescode.ai", "enterprise delivery"],
    ["Coca-Cola × 3", "TH · PH · India"],
    ["AI + products", "PIKU · Relive"],
  ];
  return (
    <svg viewBox="0 0 220 220" width="100%" style={{ maxWidth: 220, display: "block" }}>
      <defs>
        <marker id="orb-arr-c" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
        </marker>
      </defs>
      {items.map(([label, sub], i) => {
        const y = 8 + i * 52;
        return (
          <g key={label}>
            {i > 0 && <line x1={110} y1={y - 18} x2={110} y2={y - 4} stroke="var(--accent)" strokeWidth={1.2} markerEnd="url(#orb-arr-c)" />}
            {node(10, y, 200, label, sub)}
          </g>
        );
      })}
    </svg>
  );
}

function DeliveryFlow() {
  const steps = ["Discovery", "Design", "Build", "Integrate", "UAT", "Go-live", "Support"];
  const w = 48;
  const gap = 5;
  return (
    <svg viewBox="0 0 380 56" width="100%" style={{ maxWidth: "100%", display: "block" }}>
      <defs>
        <marker id="orb-arr-d" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--neon2)" />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const x = i * (w + gap);
        return (
          <g key={s}>
            {i > 0 && <line x1={x - gap} y1={22} x2={x} y2={22} stroke="var(--neon2)" strokeWidth={1} markerEnd="url(#orb-arr-d)" />}
            <rect x={x} y={8} width={w} height={28} rx={6} fill="var(--bg3)" stroke="var(--line2)" />
            <text x={x + w / 2} y={25} textAnchor="middle" fill="var(--ink)" fontSize={6.5} fontFamily="var(--font-mono)">
              {s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function IntegrationFlow() {
  const nodes = [["ERP / DMS", "source"], ["API Gateway", "auth"], ["Kafka", "events"], ["Master data", "sync"], ["Platform", "orders"]];
  return (
    <svg viewBox="0 0 220 200" width="100%" style={{ maxWidth: 220, display: "block" }}>
      <defs>
        <marker id="orb-arr-i" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--neon1)" />
        </marker>
      </defs>
      {nodes.map(([label, sub], i) => {
        const y = 4 + i * 38;
        return (
          <g key={label}>
            {i > 0 && <line x1={110} y1={y - 6} x2={110} y2={y} stroke="var(--neon1)" strokeWidth={1.2} markerEnd="url(#orb-arr-i)" />}
            {node(10, y, 200, label, sub)}
          </g>
        );
      })}
    </svg>
  );
}

function ProjectsFlow() {
  const items = [
    ["PIKU", "building · local AI OS"],
    ["Relive Cure", "live · clinic CRM"],
    ["MandiBhai", "wholesale commerce"],
  ];
  return (
    <svg viewBox="0 0 260 90" width="100%" style={{ maxWidth: 260, display: "block" }}>
      {items.map(([label, sub], i) => node(4 + i * 86, 8, 80, label, sub, i === 1 ? "var(--neon1)" : undefined))}
    </svg>
  );
}

function AiFlow() {
  const steps = ["Raw input", "LLM + context", "Transform", "Validate", "Ship"];
  const w = 58;
  const gap = 6;
  return (
    <svg viewBox="0 0 340 56" width="100%" style={{ maxWidth: "100%", display: "block" }}>
      <defs>
        <marker id="orb-arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--neon1)" />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const x = i * (w + gap);
        return (
          <g key={s}>
            {i > 0 && <line x1={x - gap} y1={22} x2={x} y2={22} stroke="var(--neon1)" strokeWidth={1} markerEnd="url(#orb-arr-a)" />}
            <rect x={x} y={8} width={w} height={28} rx={6} fill="var(--bg3)" stroke="var(--line2)" />
            <text x={x + w / 2} y={25} textAnchor="middle" fill="var(--ink)" fontSize={7} fontFamily="var(--font-mono)">
              {s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SkillsFlow() {
  const cols = [
    ["Core", "consulting · delivery"],
    ["Tech", "SQL · Kafka · APIs"],
    ["AI", "LLM · RAG · agents"],
  ];
  return (
    <svg viewBox="0 0 260 70" width="100%" style={{ maxWidth: 260, display: "block" }}>
      {cols.map(([label, sub], i) => node(4 + i * 86, 8, 80, label, sub))}
    </svg>
  );
}

function HiringFlow() {
  const steps = ["Enterprise delivery", "3-country Coke rollout", "AI + integration depth", "Let's talk"];
  return (
    <svg viewBox="0 0 220 200" width="100%" style={{ maxWidth: 220, display: "block" }}>
      <defs>
        <marker id="orb-arr-h" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent3)" />
        </marker>
      </defs>
      {steps.map((label, i) => {
        const y = 8 + i * 46;
        return (
          <g key={label}>
            {i > 0 && <line x1={110} y1={y - 14} x2={110} y2={y - 4} stroke="var(--accent3)" strokeWidth={1.2} markerEnd="url(#orb-arr-h)" />}
            {node(10, y, 200, label, undefined, i === 3 ? "var(--accent)" : undefined)}
          </g>
        );
      })}
    </svg>
  );
}

function IncidentFlow() {
  const steps = [
    ["Symptom", "order failed"],
    ["Trace", "API → Kafka → SQL"],
    ["Root cause", "stale master"],
    ["Fix", "patch + replay"],
  ];
  return (
    <svg viewBox="0 0 220 200" width="100%" style={{ maxWidth: 220, display: "block" }}>
      <defs>
        <marker id="orb-arr-x" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent3)" />
        </marker>
      </defs>
      {steps.map(([label, sub], i) => {
        const y = 8 + i * 46;
        return (
          <g key={label}>
            {i > 0 && <line x1={110} y1={y - 14} x2={110} y2={y - 4} stroke="var(--accent3)" strokeWidth={1.2} markerEnd="url(#orb-arr-x)" />}
            {node(10, y, 200, label, sub, i === 0 ? "var(--accent3)" : i === 3 ? "var(--accent2)" : undefined)}
          </g>
        );
      })}
    </svg>
  );
}

const CHARTS: Record<FlowchartId, { title: string; Component: () => React.JSX.Element }> = {
  overview: { title: "How I work — one seat", Component: OverviewFlow },
  career: { title: "Career path", Component: CareerFlow },
  delivery: { title: "How I deliver", Component: DeliveryFlow },
  integration: { title: "Integration flow", Component: IntegrationFlow },
  projects: { title: "What I'm building", Component: ProjectsFlow },
  ai: { title: "AI in my workflow", Component: AiFlow },
  skills: { title: "Skills map", Component: SkillsFlow },
  hiring: { title: "Why hire me", Component: HiringFlow },
  incident: { title: "How I debug production", Component: IncidentFlow },
};

export function OrbFlowchart({ id }: { id: FlowchartId }) {
  const chart = CHARTS[id];
  const { title, Component } = chart;
  return (
    <div
      style={{
        marginTop: 10,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "var(--bg)",
        overflowX: "auto",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>
        {title}
      </div>
      <Component />
    </div>
  );
}

export function ResumeDownloadCard() {
  return (
    <a
      href="/resume/jaskirat-singh-resume.pdf"
      download="Jaskirat-Singh-Resume.pdf"
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 10,
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid color-mix(in srgb, var(--accent) 45%, var(--line2))",
        background: "color-mix(in srgb, var(--accent) 8%, var(--bg3))",
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <span style={{ fontSize: 22 }}>📄</span>
      <span>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>Download resume (PDF)</div>
        <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>Jaskirat Singh — Solutions &amp; Implementation</div>
      </span>
      <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>↓ PDF</span>
    </a>
  );
}
