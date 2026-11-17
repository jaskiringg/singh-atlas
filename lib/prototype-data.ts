export const PERSONAS = [
  { key: "consultant", label: "Consultant", color: "#7ba0ff", desc: "In front of the customer — discovery, alignment, the deck." },
  { key: "builder", label: "Builder", color: "#2cd6b8", desc: "In the system — SQL, Kafka, APIs, frontend, architecture." },
  { key: "operator", label: "Operator", color: "#c08bff", desc: "Owning production — incidents, adoption, iteration." },
] as const;

export type CaseShot = { src: string; label: string };

export type CaseDiagram = "integration" | "incident" | "relive" | "commerce" | "piku";

export type CaseStudy = {
  id: string;
  numLabel: string;
  kicker: string;
  title: string;
  status: string;
  transferred?: boolean;
  flagship?: boolean;
  context: string;
  problem: string;
  role: string;
  architecture: string;
  implementation: string[];
  /** @deprecated use implementation */
  did: string[];
  stack: string[];
  outcome: string;
  tags: string[];
  shots: CaseShot[];
  shot: string | null;
  shotLabel: string;
  diagram?: CaseDiagram;
  showScaiLayer?: boolean;
  docHref?: string;
  githubHref?: string | null;
  liveHref?: string | null;
};

export const CASES: CaseStudy[] = [
  {
    id: "salescode",
    numLabel: "01",
    kicker: "Flagship · Salescode.ai",
    title: "Salescode AI × Coca-Cola",
    status: "Live engagement",
    context:
      "Senior Technical Project Development Associate at Salescode.ai, July 2024 onwards. Enterprise ordering, distribution and field-sales implementations for Coca-Cola bottlers in Thailand, the Philippines and North India. One major account: a wholesaler-to-retailer ordering platform for a Thai bottler responsible for about 20% of Coca-Cola consumption in Thailand — that 20% is the account's scale, not a personal result.",
    problem:
      "Product and outlet masters, distributor and sales hierarchies, pricing and discounts, stock, retailer and wholesaler orders, and incremental changes from source systems all had to stay consistent across the customer's ERP / DMS / field-sales systems and the Salescode platform.",
    role:
      "Customer-facing technical owner of the implementation: discovery, mappings, integrations on the Salescode platform, SIT/UAT, go-live and hypercare. I did not build the Salescode platform or its Kafka infrastructure.",
    architecture:
      "Customer ERP / DMS / field-sales → REST, Kafka and scheduled jobs → integration and transformation (field mapping, customer rules, delta sync, validation) → Salescode ordering and distribution platform. SCAI sits beside that as an application-layer voice agent on managed STT, TTS, LLM and retrieval.",
    implementation: [
      "Discovery with client leadership, business, sales and operations — existing and target workflows, implementation plans, dependencies, field mappings, transformation rules and validation scenarios. Onsite in Thailand.",
      "Integrations on the Salescode platform: REST, Kafka-based flows, SQL validation and reconciliation, source-to-destination mapping, delta sync, scheduled jobs, customer-specific transformation.",
      "SIT and UAT coordination, Postman, SQL validation, defect triage, go-live, hypercare, CloudWatch and application logs, runbooks, SOPs, knowledge transfer.",
      "SCAI application layer: conversation flows, call outcomes and qualification, guardrails, section-wise RAG chunking, retrieval context, writeback. I did not build the speech stack or the models.",
      "Coke Buddy retailer UX: delivery MOQ calendar, catalog search, and pack-type / pack-size lanes — portfolio shot with outlet identifiers removed.",
    ],
    did: [
      "Discovery with client leadership, business, sales and operations — existing and target workflows, implementation plans, dependencies, field mappings, transformation rules and validation scenarios. Onsite in Thailand.",
      "Integrations on the Salescode platform: REST, Kafka-based flows, SQL validation and reconciliation, source-to-destination mapping, delta sync, scheduled jobs, customer-specific transformation.",
      "SIT and UAT coordination, Postman, SQL validation, defect triage, go-live, hypercare, CloudWatch and application logs, runbooks, SOPs, knowledge transfer.",
      "SCAI application layer: conversation flows, call outcomes and qualification, guardrails, section-wise RAG chunking, retrieval context, writeback. I did not build the speech stack or the models.",
      "Coke Buddy retailer UX: delivery MOQ calendar, catalog search, and pack-type / pack-size lanes — portfolio shot with outlet identifiers removed.",
    ],
    stack: ["REST", "Kafka (platform bus)", "SQL", "Postman", "CloudWatch", "SCAI application layer"],
    outcome:
      "Production rollouts reached go-live across three countries, with field and back-office teams working on the platform. No percentage claims here — none is tied to a single implementation on this page.",
    tags: ["SQL", "REST", "Kafka", "SCAI", "RAG", "UAT"],
    shots: [{ src: "/shots/salescode-coke-buddy-products-web.png", label: "Coke Buddy · product browse (redacted)" }],
    shot: "/shots/salescode-coke-buddy-products-web.png",
    shotLabel: "Coke Buddy · product browse",
    diagram: "integration",
    showScaiLayer: true,
    flagship: true,
    docHref: "/work/salescode",
    githubHref: null,
    liveHref: null,
  },
  {
    id: "relivecure",
    numLabel: "02",
    kicker: "Freelance · call & lead intelligence",
    title: "ReliveCure",
    status: "Transferred to their team",
    transferred: true,
    context:
      "Freelance build: a call-intelligence and lead-lifecycle platform for a client whose new business arrived through Meta Ads, WhatsApp, voice IVR, rep dialling and recordings — all in different tools. I designed and shipped the system, then transferred it to their internal team. I do not operate it now.",
    problem:
      "The same person could exist as three leads, two call logs and one WhatsApp thread with no shared identity. Reps could not see whether someone had already been contacted, and leadership could not read the timeline without opening five tabs.",
    role:
      "Independent developer end to end: data model, ingestion and matching, AI-assisted processing at the application layer, operator dashboard, and handover documentation. I did not build Gemini; I integrated it.",
    architecture:
      "Multi-channel intake (ads, messaging, telephony, rep calls) → ingestion and identity resolution (dedupe, match raw call rows to leads) → AI-assisted processing (transcription, qualification signals, follow-up context) → unified timeline and dashboard. One system of record for leads, calls, transcripts and events.",
    implementation: [
      "PostgreSQL schema tying leads, calls, recordings, transcripts, WhatsApp threads, AI analysis rows and timeline events.",
      "Matching and deduplication so raw telephony rows resolve to unique calls and the correct lead record.",
      "Pulse ops dashboard: same-day call tiles, connect rate, pipeline / winback counts, attendance, and health pills (sync, bot, CRM push).",
      "Intraday call-activity charts, per-rep stats (calls, talk time, connect %, flags), and a Needs you queue ranked by idle time and follow-up debt.",
      "The flow — today: funnel from WhatsApp intake through bot, qualification, push, follow-up, consult and close — wired to live counts, not a static diagram.",
      "Recent signals feed (score jumps, call raised, new concerns) plus modules for WhatsApp chat backlog, tasks, Bot Lab, IVR and rep app.",
      "Node services for ingestion and APIs; React dashboard; Kotlin/Android for field surfaces. Gemini at the application layer — prompts, guardrails, fallbacks.",
      "Handover: runbooks, schema notes and transfer to the client's team. No production URL published here.",
    ],
    did: [
      "PostgreSQL schema tying leads, calls, recordings, transcripts, WhatsApp threads, AI analysis rows and timeline events.",
      "Matching and deduplication so raw telephony rows resolve to unique calls and the correct lead record.",
      "Pulse ops dashboard: same-day call tiles, connect rate, pipeline / winback counts, attendance, and health pills (sync, bot, CRM push).",
      "Intraday call-activity charts, per-rep stats (calls, talk time, connect %, flags), and a Needs you queue ranked by idle time and follow-up debt.",
      "The flow — today: funnel from WhatsApp intake through bot, qualification, push, follow-up, consult and close — wired to live counts, not a static diagram.",
      "Recent signals feed (score jumps, call raised, new concerns) plus modules for WhatsApp chat backlog, tasks, Bot Lab, IVR and rep app.",
      "Node services for ingestion and APIs; React dashboard; Kotlin/Android for field surfaces. Gemini at the application layer — prompts, guardrails, fallbacks.",
      "Handover: runbooks, schema notes and transfer to the client's team. No production URL published here.",
    ],
    stack: ["Kotlin", "Node.js", "PostgreSQL", "React", "Gemini"],
    outcome:
      "Built and transferred. The portfolio shows the name and a real dashboard shot (identifiers redacted). Operating metrics, ad spend and production links are not published.",
    tags: ["PostgreSQL", "Matching", "Gemini", "React"],
    shots: [
      { src: "/shots/relive-pulse-web.png", label: "Pulse · ops dashboard" },
      { src: "/shots/relive-analytics-web.png", label: "Analytics · health & campaigns" },
      { src: "/shots/relive-marketing-web.png", label: "Marketing · Meta Ads" },
      { src: "/shots/relive-leads-web.png", label: "Leads · timeline drawer" },
      { src: "/shots/relive-call-pipeline-web.png", label: "Call pipeline · jobs" },
    ],
    shot: "/shots/relive-pulse-web.png",
    shotLabel: "Pulse · ops dashboard",
    diagram: "relive",
    docHref: "/work/relivecure",
    githubHref: "https://github.com/jaskiringg/relive-cure",
    liveHref: null,
  },
  {
    id: "piku",
    numLabel: "03",
    kicker: "In progress · concept",
    title: "PIKU",
    status: "In progress · concept",
    context:
      "A local-first personal AI workspace: persistent memory, retrieval, context assembly, agent workflows. Documented direction is Tauri, Rust, React, TypeScript, Ollama and local models. The architecture drawing is a direction, not a verified deployment.",
    problem:
      "Assistants drop context between sessions. Knowledge is scattered. Cloud-only AI trades away custody. Retrieval alone is not a world model.",
    role: "Product designer and developer — personal project, in progress.",
    architecture:
      "UI (React · TypeScript · Tauri) → application and orchestration (Rust, tools, agent workflows) → memory + retrieval, with a world-model and agents layer on a local model runtime (Ollama). Conceptual, not a production diagram.",
    implementation: [
      "Designed persistent memory, RAG over local knowledge, and context assembly as current build areas.",
      "Designed agent workflows and local-first execution with a swappable model.",
      "World model, memory system and autonomous agents are not claimed as production-ready.",
    ],
    did: [
      "Designed persistent memory, RAG over local knowledge, and context assembly as current build areas.",
      "Designed agent workflows and local-first execution with a swappable model.",
      "World model, memory system and autonomous agents are not claimed as production-ready.",
    ],
    stack: ["Tauri", "Rust", "React", "TypeScript", "Ollama"],
    outcome: "In progress. Designed, not a shipped system.",
    tags: ["Tauri", "Ollama", "RAG", "Privacy"],
    shots: [],
    shot: null,
    shotLabel: "In progress · no product shots",
    diagram: "piku",
    docHref: "/work/piku",
    githubHref: "https://github.com/jaskiringg/piku",
    liveHref: null,
  },
  {
    id: "mandibhai",
    numLabel: "04",
    kicker: "Freelance · wholesale commerce",
    title: "Mandi Bhai",
    status: "Transferred to their team",
    transferred: true,
    context:
      "Early version of a B2B wholesale marketplace: inventory, pricing and ordering APIs, plus the retailer-facing UI. Freelance. I do not operate the current marketplace.",
    problem:
      "Wholesaler-to-retailer ordering ran on manual coordination — inventory, price and order in separate conversations.",
    role: "Builder of the early mobile marketplace and its APIs, then handover.",
    architecture:
      "Wholesaler manages products, stock and prices → marketplace APIs (inventory, pricing, ordering) → retailer browses and places orders. Conceptual flow of the version I built.",
    implementation: [
      "Early mobile marketplace and the inventory, pricing and ordering APIs under it.",
      "Shared product layer so the same SKU can be compared across wholesalers.",
      "Cart split per wholesaler before confirmation, with each supplier minimum visible.",
      "Stock deducted on order placement in that early version.",
    ],
    did: [
      "Early mobile marketplace and the inventory, pricing and ordering APIs under it.",
      "Shared product layer so the same SKU can be compared across wholesalers.",
      "Cart split per wholesaler before confirmation, with each supplier minimum visible.",
      "Stock deducted on order placement in that early version.",
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL"],
    outcome: "Transferred to their team. No adoption, GMV or revenue claimed — not my company.",
    tags: ["Next.js", "Orders", "Inventory"],
    shots: [
      { src: "/shots/mandibhai-ui-home.jpg", label: "Retailer home" },
      { src: "/shots/mandibhai-ui-categories.jpg", label: "Categories" },
      { src: "/shots/mandibhai-ui-cart-split.jpg", label: "Split cart · MOQ" },
      { src: "/shots/mandibhai-ui-bulk.jpg", label: "Buy in bulk" },
    ],
    shot: "/shots/mandibhai-ui-home.jpg",
    shotLabel: "Retailer home",
    diagram: "commerce",
    docHref: "/work/mandibhai",
    githubHref: "https://github.com/jaskiringg/mandibhai",
    liveHref: null,
  },
];

export const RELIVE_LIFECYCLE_FLOW = [
  { label: "Meta Ads", sub: "lead capture" },
  { label: "WhatsApp", sub: "inbound threads" },
  { label: "Voice IVR", sub: "automated calls" },
  { label: "Rep calls", sub: "manual dial" },
  { label: "Ingest + match", sub: "dedupe · identity", accent: true },
  { label: "AI assist", sub: "transcripts · routing" },
  { label: "Timeline", sub: "single record", accent: true },
];

export const MANDI_COMMERCE_FLOW = [
  { label: "Wholesaler", sub: "catalog · stock · price" },
  { label: "Marketplace APIs", sub: "inventory · orders", accent: true },
  { label: "Compare SKUs", sub: "cross-supplier" },
  { label: "Split cart", sub: "MOQ per wholesaler" },
  { label: "Place order", sub: "stock reserve", accent: true },
];

export const PIKU_STACK_FLOW = [
  { label: "UI", sub: "React · Tauri" },
  { label: "Orchestration", sub: "Rust · tools", accent: true },
  { label: "Memory + RAG", sub: "local knowledge" },
  { label: "Agents", sub: "workflows (design)" },
  { label: "Ollama", sub: "local models" },
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
    purpose: "ReliveCure — transferred to their team.",
    shows: "Dashboard from the portfolio; I do not operate it now",
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
    name: "ReliveCure",
    status: "Freelance · handed over",
    body: "ReliveCure. Transferred to their team. I do not operate it now.",
    shots: [
      { label: "Pulse", src: "/shots/relive-pulse-web.png" },
      { label: "Analytics", src: "/shots/relive-analytics-web.png" },
      { label: "Marketing", src: "/shots/relive-marketing-web.png" },
      { label: "Leads", src: "/shots/relive-leads-web.png" },
    ],
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

/** Homepage metrics — only figures that are tied and allowed. */
export const METRICS = [
  { n: "3", l: "countries live" },
  { n: "~20%", l: "Thai bottler share of Coca-Cola consumption — account scale" },
  { n: "Jul 2024", l: "Salescode.ai · present" },
  { n: "SCAI", l: "application layer, not the engines" },
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
  { t: "CAW Studios · Associate SDET · Nov 2023–Jun 2024", d: "API and backend test automation in Postman and Playwright for Postman, Paytm and Celito. Cross-system SQL validation. Diagnosing integration failures across APIs, databases and backend services." },
  { t: "Salescode.ai · Senior Technical Project Development Associate · Jul 2024–now", d: "Enterprise implementations for Coca-Cola bottlers in Thailand, the Philippines and North India — discovery, integrations on the Salescode platform, SIT/UAT, go-live, hypercare. SCAI at the application layer.", isNow: true },
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
  { id: "overview", label: "Overview" },
  { id: "work", label: "Selected Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "lab", label: "Engineering Lab" },
  { id: "approach", label: "Approach" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const REPO_GROUP_NEON: Record<string, string> = {
  AI: "var(--neon1)",
  Product: "var(--neon2)",
  Systems: "var(--neon3)",
};

export const RECRUITER_BULLETS = [
  "Senior Technical Project Development Associate, Salescode.ai — Jul 2024 onwards",
  "Coca-Cola bottlers: Thailand, the Philippines, North India",
  "Integrations on the Salescode platform — REST, Kafka flows, SQL validation. I did not build the platform or Kafka.",
  "SCAI application layer: flows, guardrails, RAG, writeback — not the STT/TTS/LLM engines",
];

export const CAPABILITIES = [
  {
    id: "pipelines",
    title: "Data pipelines",
    body: "How a record proceeds through systems — source, map, validate, land — so operations can trust the next screen.",
  },
  {
    id: "movement",
    title: "How data moves",
    body: "REST, Kafka-based flows and scheduled jobs on the Salescode platform. I implement against that bus. I did not build Kafka.",
  },
  {
    id: "insight",
    title: "From data to insight",
    body: "SQL reconciliation, golden-file checks, and the questions a dashboard is allowed to answer once masters agree.",
  },
  {
    id: "mapping",
    title: "Mapping and automation",
    body: "Field maps, customer-specific transforms, delta sync, and the jobs that stop people copying stock and price by hand.",
  },
  {
    id: "kpi",
    title: "KPI management",
    body: "Define the metric with the business, then hold it through SIT, UAT and hypercare — not a vanity number on a slide.",
  },
  {
    id: "delivery",
    title: "Delivery",
    body: "Timelines, SIT, UAT, go-live and hypercare. Happy-path SIT is not the same as UAT on hierarchy, promo stacking and legacy aliases.",
  },
];

export const APPROACH_STEPS = [
  { n: "01", title: "Discovery", body: "Leadership, business, sales, operations. What they think the workflow is, in the room, onsite when it matters." },
  { n: "02", title: "As-is / to-be", body: "Existing and target workflows. The delays are usually two mental models of the same field name." },
  { n: "03", title: "Dependencies", body: "What has to stay consistent: product and outlet masters, hierarchies, pricing, stock, orders, deltas from source systems." },
  { n: "04", title: "Field mapping", body: "Source-to-destination maps, transformation rules, customer-specific logic. Written down before anyone writes a consumer." },
  { n: "05", title: "Integration", body: "REST, Kafka-based flows, SQL validation, delta sync, scheduled jobs — on the Salescode platform, not a platform I built." },
  { n: "06", title: "Validation scenarios", body: "What must be true after a sync. Golden files. The cases SIT will never see if you only test the happy path." },
  { n: "07", title: "SIT and UAT", body: "SIT can pass on the happy path. UAT is where hierarchy, promo stacking and legacy aliases fail." },
  { n: "08", title: "Go-live & hypercare", body: "Cutover, CloudWatch and application logs, runbooks, SOPs, knowledge transfer. Leave it repeatable." },
];

export const EXPERIENCE = [
  {
    org: "CAW Studios",
    title: "Associate SDET",
    dates: "Nov 2023 – Jun 2024",
    now: false,
    body: "API and backend test automation in Postman and Playwright for Postman, Paytm and Celito. Cross-system SQL validation. Diagnosing integration failures across APIs, databases and backend services.",
  },
  {
    org: "Salescode.ai",
    title: "Senior Technical Project Development Associate",
    dates: "Jul 2024 – present",
    now: true,
    body: "Enterprise ordering, distribution and field-sales implementations for Coca-Cola bottlers in Thailand, the Philippines and North India. Discovery through hypercare. SCAI at the application layer. I did not build the Salescode platform, its Kafka infrastructure, or the STT/TTS/LLM engines.",
  },
];

export const AI_IN_WORKFLOW = [
  "Turning a raw integration payload into a draft data contract, then I check it.",
  "SQL I will actually run against mock or SIT — never blindly against production.",
  "Workshop notes into an architecture doc someone else can follow.",
  "SCAI: section-wise RAG chunking, retrieval context, qualification, writeback. Application layer.",
];
