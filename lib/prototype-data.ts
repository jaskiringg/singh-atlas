export const PERSONAS = [
  { key: "consultant", label: "Consultant", color: "#7ba0ff", desc: "In front of the customer — discovery, alignment, the deck." },
  { key: "builder", label: "Builder", color: "#2cd6b8", desc: "In the system — SQL, Kafka, APIs, frontend, architecture." },
  { key: "operator", label: "Operator", color: "#c08bff", desc: "Owning production — incidents, adoption, iteration." },
] as const;

export type CaseStudy = {
  id: string;
  numLabel: string;
  kicker: string;
  title: string;
  context: string;
  did: string[];
  outcome: string;
  tags: string[];
  shot: string | null;
  shotLabel: string;
  diagramType?: "flow" | "trace";
};

export const CASES: CaseStudy[] = [
  {
    id: "salescode",
    numLabel: "01",
    kicker: "Consulting · technical · delivery",
    title: "Salescode × Coca-Cola",
    context:
      "Owning an enterprise retail-execution rollout for Coca-Cola bottlers across Thailand, the Philippines and North India — the whole arc, from the first workshop to production support.",
    did: [
      "Ran requirement-gathering and discovery workshops with business and IT stakeholders — onsite in Thailand.",
      "Built operator playbooks and automations so the field process runs the same way every time.",
      "Designed and debugged the integrations between the platform and the bottlers' field / DMS systems (REST, Kafka, SQL).",
      "Managed delivery end to end — UAT, SIT, go-live across regions and customer onboarding.",
    ],
    outcome: "Live across three countries, with field-sales and back-office systems finally speaking the same language.",
    tags: ["SQL", "REST", "Kafka", "Postman", "Jira", "Confluence"],
    shot: "/shots/salescode-coke-buddy.png",
    shotLabel: "Coke Buddy · Thailand",
  },
  {
    id: "integration",
    numLabel: "02",
    kicker: "Architecture",
    title: "The integration layer that holds it together",
    context:
      "One platform has to survive many local systems. The integration architecture is where that actually happens — and where the value quietly hides.",
    did: [
      "Designed how ERP / DMS, master data (product, customer, outlet, hierarchy) and the platform stay in sync.",
      "Handled the hard parts: delta sync, idempotency, fail-safe consumers and reconciliation when upstream drifts.",
      "Kept business rules in the integration layer — enforced at the boundary, not left to client discipline.",
    ],
    outcome: "Field systems and the central platform agree on one version of the truth.",
    tags: ["ERP / DMS", "Kafka", "Delta sync", "Master data", "API orchestration"],
    shot: null,
    shotLabel: "Integration architecture",
    diagramType: "flow",
  },
  {
    id: "incident",
    numLabel: "03",
    kicker: "Operator · the way I think",
    title: "When it breaks in production, I own it",
    context:
      "A field rep couldn't sync an order. Go-live had happened three weeks earlier — this one landed on me anyway.",
    did: [
      "Worked it back from the symptom: an API timeout at the gateway.",
      "Followed the thread to a Kafka consumer lag, then a SQL mismatch on a stale product-master record.",
      "Root cause: a dropped delta-sync update. Patched the sync, replayed the events, verified the rep was green.",
    ],
    outcome: "Back to healthy the same day — and the failure mode designed out so it can't recur quietly.",
    tags: ["Root-cause analysis", "SQL", "Kafka", "Production support"],
    shot: null,
    shotLabel: "Incident → resolution",
    diagramType: "trace",
  },
];

export const INTEGRATION_FLOW = [
  { label: "ERP / DMS / POS", sub: "source systems" },
  { label: "API Gateway", sub: "auth · routing · rate limit" },
  { label: "Kafka topics", sub: "events · partitions" },
  { label: "Master data", sub: "product · customer · outlet" },
  { label: "Sales platform", sub: "orders · pricing · tax" },
];

export const INCIDENT_TRACE = [
  { label: "Order failed", sub: "field rep can't sync", kind: "fail" as const },
  { label: "API timeout", sub: "gateway 504", kind: "" as const },
  { label: "Kafka consumer lag", sub: "partition backed up", kind: "" as const },
  { label: "SQL mismatch", sub: "stale product-master FK", kind: "" as const },
  { label: "Root cause", sub: "delta sync dropped a master update", kind: "root" as const },
  { label: "Patch + replay", sub: "backfill · re-consume", kind: "" as const },
  { label: "Production restored", sub: "sync green", kind: "fixed" as const },
];

export type DocItem = {
  name: string;
  kind: string;
  file: string;
  title: string;
  sub: string;
  docKind: "deck" | "flow" | "spec" | "runbook" | "trace" | "playbook";
  slides?: { n: string; t: string }[];
  boxes?: string[];
  lines?: string[];
  code?: string[];
  steps?: { num: string; label: string }[];
  rows?: { a: string; b: string }[];
  phases?: { p: string; nLabel: string }[];
};

export const DOCS: DocItem[] = [
  {
    name: "Executive PPT",
    kind: "deck · 18 slides",
    file: "CocaCola_InventorySync_v4.pptx",
    title: "Inventory synchronization",
    sub: "Slide 12 · executive review",
    docKind: "deck",
    slides: [
      { n: "01", t: "Business problem" },
      { n: "02", t: "Current workflow" },
      { n: "03", t: "Pain points" },
      { n: "04", t: "Future workflow" },
      { n: "05", t: "Architecture" },
      { n: "06", t: "Timeline" },
      { n: "07", t: "Go-live" },
    ],
  },
  {
    name: "Architecture diagram",
    kind: "system design",
    file: "integration_architecture.excalidraw",
    title: "Integration architecture",
    sub: "ERP ↔ platform ↔ analytics",
    docKind: "flow",
    boxes: ["Source systems", "API gateway", "Kafka topics", "Master data", "Consumers"],
  },
  {
    name: "Technical spec",
    kind: "engineering doc",
    file: "delta_sync_spec.md",
    title: "Delta sync specification",
    sub: "contract · edge cases · retries",
    docKind: "spec",
    lines: ["Scope", "Data contract", "Sync strategy", "Failure modes", "Retry / replay", "Acceptance"],
    code: ["topic: master.product.delta", "group: sync-product-master", "retry.attempts: 5", "dead_letter: master.product.dlq"],
  },
  {
    name: "Confluence",
    kind: "knowledge base",
    file: "Implementation — Runbook",
    title: "Implementation runbook",
    sub: "go-live · support · escalation",
    docKind: "runbook",
    steps: [
      { num: "01", label: "Pre-go-live checklist" },
      { num: "02", label: "Cutover steps" },
      { num: "03", label: "Validation" },
      { num: "04", label: "Rollback plan" },
      { num: "05", label: "Support matrix" },
    ],
  },
  {
    name: "Requirement mapping",
    kind: "BRD → tech",
    file: "requirements_traceability.xlsx",
    title: "Requirements traceability",
    sub: "business ask → technical answer",
    docKind: "trace",
    rows: [
      { a: "Inventory visibility", b: "API + delta sync" },
      { a: "Order sync", b: "Kafka + retry" },
      { a: "Pricing rules", b: "Promotion engine" },
      { a: "Onboarding flow", b: "UAT + training" },
    ],
  },
  {
    name: "Implementation playbook",
    kind: "repeatable delivery",
    file: "playbook.md",
    title: "Implementation playbook",
    sub: "discovery → go-live, repeatable",
    docKind: "playbook",
    phases: [
      { p: "Discovery", nLabel: "4 checks" },
      { p: "Design", nLabel: "3 checks" },
      { p: "Build", nLabel: "6 checks" },
      { p: "Test", nLabel: "5 checks" },
      { p: "Cutover", nLabel: "3 checks" },
      { p: "Hypercare", nLabel: "2 checks" },
    ],
  },
];

export const GITHUB_USER = "jaskiringg";

export const REPOS = [
  { name: "piku", group: "AI", purpose: "Ambient AI operating system — local-first, persistent memory.", shows: "World models, retrieval, agent orchestration", stack: "Tauri · Rust · Ollama", featured: true },
  { name: "relive-cure", group: "Product", purpose: "Agent-driven organic marketing + CRM for a clinic I operate daily.", shows: "AI agents, content pipeline, production ops", stack: "Node · Supabase · Gemini", featured: true },
  { name: "mitra-friend-only-messaging", group: "Product", purpose: "Friend-request-only messaging with backend-enforced moderation.", shows: "Trust boundaries, CometChat, API enforcement", stack: "TypeScript · CometChat", featured: false },
  { name: "lasik-consultation-bot", group: "Systems", purpose: "Trilingual WhatsApp consultation qualifier — precursor to Relive.", shows: "Messaging as a production channel", stack: "Node · WhatsApp", featured: false },
  { name: "lead-scoring-dashboard", group: "Systems", purpose: "Lead-scoring engine with the logic as the product.", shows: "Business rules in code, SLA bands", stack: "Python · Streamlit", featured: false },
];

export type BuildShot = { label: string; src: string };

export const BUILDS = [
  {
    name: "PIKU",
    status: "Building",
    body: "I got tired of re-explaining myself to a chatbot every session, so I'm building the opposite: something local-first that actually remembers — a running model of what I'm doing, thinking about, and learning.",
    shots: [{ label: "PIKU · ambient OS home", src: "/shots/piku-home.png" }],
  },
  {
    name: "Relive Cure",
    status: "Live",
    body: "A LASIK clinic and the system that operates it, both mine. I see the patients and the leads, improve the workflows, ship the features, and own the business process and the software at the same time.",
    shots: [
      { label: "Lead analytics", src: "/shots/relive-analytics.png" },
      { label: "Agent console", src: "/shots/relive-agent-console.png" },
    ],
  },
  {
    name: "MandiBhai",
    status: "Building now",
    body: "A wholesaler-to-retailer commerce solution: wholesalers sell, retailers buy at wholesale prices and get the stuff the same day — pricing, inventory and fulfilment shaped around that one promise.",
    shots: [
      { label: "Retailer catalogue", src: "/shots/mandibhai-catalogue.png" },
      { label: "Wholesaler orders", src: "/shots/mandibhai-wholesaler.png" },
    ],
  },
];

export const METRICS = [
  { n: "Live", l: "in production" },
  { n: "8,800", l: "line operator UI" },
  { n: "5", l: "reps run on it" },
  { n: "100+", l: "security commits" },
];

export const INTERESTS = [
  "AI & context engineering",
  "Enterprise architecture",
  "Operating systems",
  "Knowledge management",
  "Distributed systems",
  "Supply chains",
  "Product design",
  "Learning fast",
];

export const TIMELINE: { t: string; d: string; isNow?: boolean }[] = [
  { t: "CAW Studios", d: "Where the craft started — building, shipping, learning the shape of real software." },
  { t: "Automation", d: "Finding the leverage: the manual processes that should have been systems." },
  { t: "Enterprise Delivery", d: "Owning implementation — discovery, integration, go-live, support." },
  { t: "International Implementations", d: "Coca-Cola across Thailand, the Philippines and North India. Scale and local constraints." },
  { t: "AI Systems", d: "AI as a delivery multiplier and an architectural primitive." },
  { t: "PIKU", d: "The system I wish existed — a personal operating layer." },
  { t: "Future", d: "Someone companies trust to own an entire system.", isNow: true },
];

export const AI_EXAMPLES = [
  "Turning a raw integration payload into a clean data contract with validation.",
  "Sanity-checking SQL before it runs anywhere near production.",
  "Turning messy meeting notes into an architecture doc someone can actually follow.",
  "A small internal copilot that remembers project context so I don't have to.",
];

export const AI_FLOW = ["Raw payload", "LLM + context", "Transformation", "Validation", "Deployment guide"];

export const LIFECYCLE = [
  "Business problem",
  "Discovery workshops",
  "Requirement gathering",
  "Business process mapping",
  "Solution design",
  "Architecture",
  "Implementation",
  "API integrations",
  "Testing · UAT / SIT",
  "Go-live",
  "Production support",
  "Stakeholder reviews",
  "Roadmap",
];

export const PRINCIPLES = [
  "Everything is a system.",
  "Architecture before implementation.",
  "Business before technology.",
  "Integrations are where systems meet.",
  "The best software disappears into operations.",
  "Technology should remove complexity, not create it.",
  "I don't build features. I build capabilities.",
];

export const NAV_ITEMS = [
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "ai", label: "AI" },
  { id: "comm", label: "Comms" },
  { id: "mind", label: "Mind" },
  { id: "personal", label: "Build" },
  { id: "path", label: "Path" },
  { id: "repos", label: "Repos" },
  { id: "contact", label: "Signal" },
];

export const REPO_GROUP_NEON: Record<string, string> = {
  AI: "var(--neon1)",
  Product: "var(--neon2)",
  Systems: "var(--neon3)",
};

export const RECRUITER_BULLETS = [
  "3 countries live — Coca-Cola retail-execution rollout",
  "8,800-line production system built & run daily",
  "Root-cause depth: SQL, Kafka, API, frontend, prod support",
];
