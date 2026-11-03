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
  docHref?: string;
  githubHref?: string | null;
  liveHref?: string | null;
};

export const CASES: CaseStudy[] = [
  {
    id: "salescode",
    numLabel: "01",
    kicker: "Consulting · technical · delivery",
    title: "Salescode × Coca-Cola",
    context:
      "Owning an enterprise retail-execution rollout for Coca-Cola bottlers across Thailand, the Philippines and North India — the whole arc, from the first workshop to production support. The Thailand bottler accounts for roughly 20% of Coca-Cola consumption in the country.",
    did: [
      "Ran requirement-gathering and discovery workshops with business and IT stakeholders — onsite in Thailand.",
      "Built operator playbooks and automations so the field process runs the same way every time.",
      "Designed and implemented integrations with customers' ERP, DMS and field-sales systems over REST, Kafka and SQL — delta syncs and scheduled jobs for pricing, master data and stock. Cut manual intervention by ~35%.",
      "Deployed SCAI, Salescode's enterprise AI voice agent: integration planning, expected call outcomes, live-call guardrails, section-wise RAG chunking and context management — application layer, not the speech or LLM engines.",
      "Managed delivery end to end — UAT, SIT, go-live across regions and customer onboarding.",
    ],
    outcome: "Live across three countries, with field-sales and back-office systems finally speaking the same language.",
    tags: ["SQL", "REST", "Kafka", "Voice AI", "RAG", "UAT"],
    shot: "/shots/salescode-coke-buddy.png",
    shotLabel: "Coke Buddy · Thailand",
    docHref: "/work/salescode",
    githubHref: null,
    liveHref: null,
  },
  {
    id: "relivecure",
    numLabel: "02",
    kicker: "Freelance · voice & WhatsApp lead platform",
    title: "ReliveCure",
    context:
      "A freelance build for a LASIK clinic in India. I scoped and built the platform end to end — ad leads, a trilingual WhatsApp agent, IVR and rep calls captured and analysed by AI, all on one lead timeline. It is live in production and the clinic's internal team runs it now.",
    did: [
      "Built lead intake from Meta Ads into one record per person, deduped across channels.",
      "Built a trilingual WhatsApp agent (Hindi, Hinglish, English) that qualifies inbound before a rep touches it.",
      "Captured IVR calls and the reps' own phone calls, then transcribed and AI-analysed every recording.",
      "Designed the data model and the matching rules that tie calls, messages and CRM events to one lead timeline.",
    ],
    outcome:
      "10,880+ leads and ~98,000 unique calls on the system; 90.7% of calls matched to a lead, 13,700+ AI-analysed. In October, 96% of new leads were called and 86% within 24 hours.",
    tags: ["WhatsApp", "Voice AI", "Kotlin", "Gemini", "Postgres"],
    shot: "/shots/relive-analytics.png",
    shotLabel: "Lead dashboard",
    docHref: "/work/relivecure",
    githubHref: "https://github.com/jaskiringg/relive-cure",
    liveHref: null,
  },
  {
    id: "piku",
    numLabel: "03",
    kicker: "Concept · passion project",
    title: "PIKU",
    context:
      "My idea for a local-first AI workspace that remembers you — persistent memory, a world model of what you are doing, and agent workflows that stay on your machine. The model is replaceable; the understanding should not be.",
    did: [
      "Designed a layered architecture: OS shell, chat, graph, world model, apps.",
      "Explored local-first memory and hybrid retrieval over on-device embeddings.",
      "Designed a privacy boundary: local-only reasoning vs an optional cloud brain behind a local proxy.",
      "Wrote the ADRs, feature inventory and roadmap as a design pack I keep thinking through.",
    ],
    outcome: "A concept I'm designing and prototyping, not a shipped product.",
    tags: ["Tauri", "Ollama", "IndexedDB", "RAG", "Privacy"],
    shot: null,
    shotLabel: "Concept · no product shots",
    docHref: "/work/piku",
    githubHref: "https://github.com/jaskiringg/piku",
    liveHref: null,
  },
  {
    id: "mandibhai",
    numLabel: "04",
    kicker: "Freelance · B2B ordering",
    title: "MandiBhai",
    context:
      "Freelance, not my startup. A B2B wholesale marketplace where kirana retailers order stock from nearby mandi wholesalers with same-day delivery. I built the early version; the client's own team carries it forward now.",
    did: [
      "Built the mobile marketplace and the inventory, pricing and ordering APIs under it.",
      "Resolved the same SKU across wholesalers onto one product, so retailers compare prices instead of making five phone calls.",
      "Split a mixed cart per wholesaler before confirmation, each supplier's minimum shown up front rather than failing at checkout.",
      "Tied stock deduction to order placement, so the platform stops promising what isn't there.",
    ],
    outcome: "Moved wholesaler-to-retailer orders off manual coordination. I built the early version; the client's team carries it on. No adoption, GMV or revenue claimed — not my company.",
    tags: ["Next.js", "Orders", "SKU admin", "Mobile UX"],
    shot: "/shots/mandibhai-ui-home.jpg",
    shotLabel: "Retailer home · redesign",
    docHref: "/work/mandibhai",
    githubHref: "https://github.com/jaskiringg/mandibhai",
    liveHref: null,
  },
];

/** Visual for voice essay tile — not a product screenshot. */
export const VOICE_LAYER_FLOW = [
  { label: "Telephony / SIP", sub: "rent", kind: "rent" as const },
  { label: "STT", sub: "rent", kind: "rent" as const },
  { label: "LLM inference", sub: "rent", kind: "rent" as const },
  { label: "TTS", sub: "rent", kind: "rent" as const },
  { label: "Conversation · RAG · tools · escalate", sub: "own", kind: "own" as const },
  { label: "CRM / lead writeback · UAT", sub: "own", kind: "own" as const },
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

export type RepoCard = {
  name: string;
  group: string;
  purpose: string;
  shows: string;
  stack: string;
  featured: boolean;
  /** Primary click → Atlas case study / design doc */
  docHref?: string;
  /** Public showcase repo under jaskiringg (omit if docs-only / no public repo) */
  githubRepo?: string;
};

export const REPOS: RepoCard[] = [
  {
    name: "piku",
    group: "AI",
    purpose: "Concept: local-first AI workspace that remembers (design + prototype).",
    shows: "World models, retrieval, agent orchestration",
    stack: "Tauri · Rust · Ollama",
    featured: true,
    docHref: "/work/piku",
    githubRepo: "piku",
  },
  {
    name: "relive-cure",
    group: "Product",
    purpose: "Freelance: voice + WhatsApp lead platform for a clinic, handed over to the client's team.",
    shows: "Call capture & AI analysis, WhatsApp qualification, one lead timeline",
    stack: "Kotlin · React · Node · Postgres · Gemini",
    featured: true,
    docHref: "/work/relivecure",
    githubRepo: "relive-cure",
  },
  {
    name: "mandibhai",
    group: "Product",
    purpose: "Freelance: B2B wholesale ordering, early version; client team continues.",
    shows: "Split cart/MOQ, catalogue, inventory, admin SKU concepts",
    stack: "NestJS · Next.js",
    featured: true,
    docHref: "/work/mandibhai",
    githubRepo: "mandibhai",
  },
];

export type BuildShot = { label: string; src: string };

export const BUILDS = [
  {
    name: "PIKU",
    status: "Concept",
    body: "A concept I keep coming back to: a local-first workspace that actually remembers — what I'm doing, thinking about, and learning. I'm designing it, not shipping it.",
    shots: [],
    docHref: "/work/piku",
    githubHref: "https://github.com/jaskiringg/piku",
  },
  {
    name: "Relive Cure",
    status: "Freelance · handed over",
    body: "A freelance build for a LASIK clinic: leads from ads, a WhatsApp agent that qualifies them, IVR and rep calls captured, every recording transcribed and analysed by AI, all on one lead timeline. It's live, and the clinic's own team runs it now.",
    shots: [{ label: "Lead dashboard", src: "/shots/relive-analytics.png" }],
    docHref: "/work/relivecure",
    githubHref: "https://github.com/jaskiringg/relive-cure",
  },
  {
    name: "MandiBhai",
    status: "Freelance · client continues",
    body: "A wholesaler-to-retailer commerce solution: wholesalers sell, retailers buy at wholesale prices and get the stuff the same day — pricing, inventory and fulfilment shaped around that one promise. I built the early version; the client's team carries it on.",
    shots: [
      { label: "Home · redesign", src: "/shots/mandibhai-ui-home.jpg" },
      { label: "Categories", src: "/shots/mandibhai-ui-categories.jpg" },
      { label: "Split cart · MOQ", src: "/shots/mandibhai-ui-cart-split.jpg" },
      { label: "Buy in bulk", src: "/shots/mandibhai-ui-bulk.jpg" },
    ],
    docHref: "/work/mandibhai",
    githubHref: "https://github.com/jaskiringg/mandibhai",
  },
];

/** ReliveCure system usage as of 3 Nov 2026 — usage of what I built, not outcomes I drove. */
export const METRICS = [
  { n: "~98,000", l: "unique calls" },
  { n: "13,700+", l: "AI-analysed calls" },
  { n: "90.7%", l: "calls matched to a lead" },
  { n: "10,880+", l: "leads" },
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
  { t: "CAW Studios · Nov 2023–Jun 2024", d: "Where the craft started — API and backend test automation for Postman, Paytm and Celito, and the habit of asking how a system will fail." },
  { t: "Automation", d: "Finding the leverage: the manual processes that should have been systems." },
  { t: "Salescode.ai · Jul 2024–now", d: "Owning implementation — discovery, integration, SIT/UAT, go-live, hypercare." },
  { t: "International Implementations", d: "Coca-Cola across Thailand, the Philippines and North India. Scale and local constraints." },
  { t: "Voice AI: SCAI at Salescode", d: "Taking an enterprise voice agent to live calls — integration, expected outcomes, guardrails, RAG context." },
  { t: "Freelance builds: ReliveCure, MandiBhai", d: "Scoped and built two platforms end to end, then handed each to the client's own team." },
  { t: "Future", d: "PIKU and the systems I wish existed — and becoming someone companies trust to own an entire system.", isNow: true },
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
  "Deployed SCAI, Salescode's AI voice agent: integration, guardrails, RAG context",
  "Freelance clinic platform: ~98,000 calls, 13,700+ AI-analysed, now run by the client's team",
  "Root-cause depth: SQL, Kafka, API, frontend, prod support",
];
