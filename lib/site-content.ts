/**
 * Portfolio content — hand-written in Jaskirat's voice.
 * Narrative goal: "this person understands systems" — business discovery to production ops.
 * Two registers: Professional (enterprise system ownership) · Personal (explorations of how I think).
 */

/* ── PROFESSIONAL — Enterprise Systems & Engagements ───────────────────
   Not isolated products. The areas I actually own. */

export const flagship = {
  name: "Salescode × Coca-Cola",
  kicker: "Flagship engagement",
  lead:
    "Owning an enterprise SaaS implementation end to end — from business discovery to production operations — for Coca-Cola bottlers across three countries.",
  rows: [
    { k: "Role", v: "Implementation consultant, systems architect and program lead in one seat. I sit between the business problem and the technical answer." },
    { k: "Discovery", v: "Requirements gathering, stakeholder workshops (onsite in Thailand), solution design and scoping with business, product and customer leadership." },
    { k: "Build", v: "API integrations, SQL analysis, configuration and orchestration across the platform and the field systems it has to speak to." },
    { k: "Ship", v: "UAT, SIT, go-live, customer onboarding, production debugging and root-cause — coordinating engineering, QA, business and product through it." },
  ],
  reach: ["Thailand · onsite workshops", "Philippines · deployment", "North India · deployment"],
  capabilities: [
    "Enterprise SaaS implementation", "Solutions consulting", "Stakeholder workshops",
    "Requirements gathering", "Technical consulting", "API integrations", "SQL",
    "Production debugging", "UAT", "SIT", "Go-live", "Customer onboarding",
    "Cross-functional leadership",
  ],
  metrics: [
    { n: "3", l: "countries live" },
    { n: "onsite", l: "Thailand workshops" },
    { n: "E2E", l: "discovery → production" },
  ],
};

/** Secondary engagement blocks — capability areas, not products. */
export type Engagement = {
  id: string;
  label: string;
  note: string;
  lead: string;
  groups?: { h: string; items: string[] }[];
  flow?: string[];
  coordinates?: string[];
  uses?: string[];
};

export const engagements: Engagement[] = [
  {
    id: "integration",
    label: "Enterprise Integration Platform",
    note: "where systems meet",
    lead:
      "The integration architecture I design across enterprise systems — making ERP, DMS and the platform agree on one version of the truth.",
    groups: [
      { h: "Masters", items: ["Product Master", "Customer Master", "Employee Master", "Outlet", "Hierarchy"] },
      { h: "Transactions", items: ["Sales", "Inventory", "Pricing", "Tax", "Promotion engines"] },
      { h: "Architecture", items: ["ERP / DMS integration", "Delta sync", "Kafka", "API orchestration"] },
    ],
  },
  {
    id: "delivery",
    label: "Enterprise Delivery",
    note: "execution, not code",
    lead:
      "Turning an ambiguous enterprise ask into a live, supported system — and keeping every stakeholder aligned through it.",
    flow: [
      "Requirements gathering", "Business workshops", "Solution design", "Customer onboarding",
      "Deployment planning", "Production support", "Root-cause analysis", "Release management",
    ],
    coordinates: ["Engineering", "QA", "Business", "Product", "Customer leadership"],
  },
  {
    id: "ai",
    label: "AI in Enterprise Delivery",
    note: "how I actually work",
    lead:
      "Not building LLMs — using AI every day to move enterprise delivery faster: documentation, payload debugging, SQL, requirements, knowledge capture.",
    uses: [
      "Architecture documentation", "Implementation playbooks", "Knowledge management",
      "Transformation analysis", "Payload debugging", "SQL generation", "Technical documentation",
      "Requirements summarization", "Context engineering", "Internal copilots", "Engineering productivity",
    ],
  },
];

/* ── Animated technical artifacts (show, don't tell) ─────────────────── */

export type PNode = { label: string; sub?: string; kind?: "gateway" | "kafka" | "fail" | "root" | "fixed" | "store" };

/** Enterprise integration — sources to analytics. */
export const integrationFlow: PNode[] = [
  { label: "ERP / DMS / POS", sub: "source systems", kind: "store" },
  { label: "API Gateway", sub: "auth · routing · rate limit", kind: "gateway" },
  { label: "Kafka topics", sub: "events · partitions", kind: "kafka" },
  { label: "Transformation layer", sub: "map · validate · enrich" },
  { label: "Master data", sub: "product · customer · outlet", kind: "store" },
  { label: "Sales platform", sub: "orders · pricing · tax" },
  { label: "Analytics", sub: "dashboards · KPIs", kind: "store" },
];

/** A real production incident, traced. */
export const debugTrace: PNode[] = [
  { label: "Order failed", sub: "field rep can't sync", kind: "fail" },
  { label: "API timeout", sub: "gateway 504" },
  { label: "Kafka consumer lag", sub: "partition backed up" },
  { label: "SQL mismatch", sub: "stale product master FK" },
  { label: "Root cause", sub: "delta sync dropped a master update", kind: "root" },
  { label: "Patch + replay", sub: "backfill · re-consume" },
  { label: "Production restored", sub: "sync green", kind: "fixed" },
];

/** AI in delivery — payload to deploy guide. */
export const aiFlow: PNode[] = [
  { label: "Raw payload / ticket", sub: "messy enterprise input" },
  { label: "LLM + context", sub: "context-engineered prompt", kind: "gateway" },
  { label: "Transformation", sub: "structure · normalize" },
  { label: "Validation", sub: "schema · business rules" },
  { label: "Documentation", sub: "architecture · playbook" },
  { label: "Confluence / KB", sub: "knowledge captured", kind: "store" },
  { label: "Deployment guide", sub: "ready to ship", kind: "fixed" },
];

/** Relive Cure — a lead becomes a patient. */
export const reliveFlow: PNode[] = [
  { label: "WhatsApp lead", sub: "inbound, any hour" },
  { label: "AI operator", sub: "Gemini · fallback chains", kind: "gateway" },
  { label: "Lead score", sub: "SLA bands · weighting" },
  { label: "Rep assignment", sub: "routed, not dropped" },
  { label: "CRM + follow-up", sub: "shadow-mode safe" },
  { label: "Appointment booked", sub: "patient in chair", kind: "fixed" },
];

/** Scroll-triggered terminal flourish. */
export const terminalLines = [
  { c: "$", t: "inspect system" },
  { c: "·", t: "loading…" },
  { c: "✓", t: "APIs discovered" },
  { c: "✓", t: "stakeholders mapped" },
  { c: "✓", t: "constraints identified" },
  { c: "✓", t: "dependencies resolved" },
  { c: "›", t: "ready for implementation." },
];

/* ── Full delivery lifecycle — business problem to roadmap ───────────── */
export const lifecycle = [
  "Business problem", "Discovery workshops", "Requirement gathering", "Business process mapping",
  "Solution design", "Architecture", "Implementation", "API integrations",
  "Testing · UAT / SIT", "Go-live", "Production support", "Stakeholder reviews", "Roadmap",
];

/* ── Consultant — discovery to go-live, as a workshop flow ───────────── */
export const discoveryFlow: PNode[] = [
  { label: "Discovery", sub: "stakeholder sessions" },
  { label: "Business process", sub: "map the as-is", kind: "gateway" },
  { label: "Pain points", sub: "where it breaks", kind: "fail" },
  { label: "Requirement mapping", sub: "to-be design" },
  { label: "Technical design", sub: "architecture · contracts" },
  { label: "Implementation", sub: "build · integrate" },
  { label: "Go-live", sub: "launched · adopted", kind: "fixed" },
];

/** Animated consulting deck — the story arc, slide by slide. */
export const deckSlides = [
  { t: "Business problem", c: "context" },
  { t: "Current workflow", c: "as-is" },
  { t: "Pain points", c: "gaps" },
  { t: "Future workflow", c: "to-be" },
  { t: "Architecture", c: "design" },
  { t: "Timeline", c: "plan" },
  { t: "Go-live", c: "launch" },
];

/* ── Operator — the production lifecycle ─────────────────────────────── */
export const operatorLifecycle = [
  "Customer reports issue", "Investigation", "SQL", "Logs", "API", "Kafka", "Fix", "Deploy", "Verify", "Close",
];

/* ── How I communicate — deliverables, not claims ────────────────────── */
export const commDocs = [
  {
    name: "Executive PPT", kind: "deck · 18 slides", file: "CocaCola_InventorySync_v4.pptx",
    title: "Inventory synchronization", sub: "Slide 12 · executive review",
    blocks: ["Current state", "Problems", "Future state", "API flow", "Deployment plan", "Timeline", "Risks"],
  },
  {
    name: "Architecture diagram", kind: "system design", file: "integration_architecture.excalidraw",
    title: "Integration architecture", sub: "ERP ↔ platform ↔ analytics",
    blocks: ["Source systems", "API gateway", "Kafka topics", "Transformation", "Master data", "Consumers"],
  },
  {
    name: "Technical spec", kind: "engineering doc", file: "delta_sync_spec.md",
    title: "Delta sync specification", sub: "contract · edge cases · retries",
    blocks: ["Scope", "Data contract", "Sync strategy", "Failure modes", "Retry / replay", "Acceptance"],
  },
  {
    name: "Confluence", kind: "knowledge base", file: "Implementation — Runbook",
    title: "Implementation runbook", sub: "go-live · support · escalation",
    blocks: ["Pre-go-live", "Cutover steps", "Validation", "Rollback", "Support matrix"],
  },
  {
    name: "Requirement mapping", kind: "BRD → tech", file: "requirements_traceability.xlsx",
    title: "Requirements traceability", sub: "business ask → technical answer",
    blocks: ["Business need", "As-is", "To-be", "API mapping", "Owner", "Status"],
  },
  {
    name: "Implementation playbook", kind: "repeatable delivery", file: "playbook.md",
    title: "Implementation playbook", sub: "discovery → go-live, repeatable",
    blocks: ["Discovery", "Design", "Build", "Test", "Cutover", "Hypercare"],
  },
];

/* ── Real code — read, not just listed ───────────────────────────────── */
export const codeSnippets = [
  {
    tab: "SQL", lang: "sql" as const,
    code: `-- find leads breaching SLA, weighted by value
SELECT l.id, l.source, l.value,
       CASE WHEN l.responded_at IS NULL
            AND NOW() - l.created_at > INTERVAL '15 min'
            THEN 'BREACH' ELSE 'OK' END AS sla,
       l.value * s.weight AS score
FROM leads l
JOIN source_weights s ON s.source = l.source
WHERE l.stage = 'new'
ORDER BY score DESC
LIMIT 50;`,
  },
  {
    tab: "API", lang: "json" as const,
    code: `// POST /v2/orders  — field rep submits an order
{
  "outletId": "TH-4471",
  "repId": "emp_2093",
  "lines": [
    { "productId": "SKU-COKE-500", "qty": 24, "price": 18.50 },
    { "productId": "SKU-SPRITE-1L", "qty": 12, "price": 29.00 }
  ],
  "promotion": "BUY10_GET1",
  "channel": "DMS"
}`,
  },
  {
    tab: "Kafka", lang: "yaml" as const,
    code: `# consumer — master-data delta, fail-safe
topic: master.product.delta
group: sync-product-master
auto.offset.reset: earliest   # never skip an update
isolation.level: read_committed
retry:
  attempts: 5
  backoff: exponential
dead_letter: master.product.dlq`,
  },
];

/* ── Persona capability tags ─────────────────────────────────────────── */
export const consultantCaps = [
  "Discovery workshops", "Requirement gathering", "Business process mapping", "Solution proposals",
  "Client presentations", "Stakeholder alignment", "Executive communication", "Confluence", "Sprint demos",
];
export const builderCaps = [
  "SQL", "Kafka", "REST APIs", "Integrations", "System design", "Architecture",
  "AI pipelines", "Java", "Python", "JSON", "Production debugging",
];
export const operatorCaps = [
  "Production support", "Incident response", "Root-cause analysis", "Go-live coordination",
  "Customer onboarding", "Release management", "Monitoring", "Owning uptime",
];

/* ── Selected work — real examples, not diagrams ─────────────────────── */
export type CaseStudy = {
  id: string;
  kicker: string;
  title: string;
  context: string;
  did: string[];
  outcome: string;
  tags: string[];
  shot?: string;
  shotLabel: string;
  shotUrl?: string;
};

export const cases: CaseStudy[] = [
  {
    id: "salescode",
    kicker: "Consulting · technical · delivery",
    title: "Salescode × Coca-Cola",
    context:
      "Owning an enterprise retail-execution rollout for Coca-Cola bottlers across Thailand, the Philippines and North India — the whole arc, from the first workshop to production support.",
    did: [
      "Ran requirement-gathering and discovery workshops with business and IT stakeholders — onsite in Thailand.",
      "Built operator playbooks and automations so the field process runs the same way every time.",
      "Designed and debugged the integrations between the platform and the bottlers' field / DMS systems (REST, Kafka, SQL).",
      "Managed delivery end to end — UAT, SIT, go-live across regions and customer onboarding.",
      "Stayed through production — root-cause analysis, fixes and the roadmap.",
    ],
    outcome: "Live across three countries, with field-sales and back-office systems finally speaking the same language.",
    tags: ["SQL", "REST", "Kafka", "Postman", "Jira", "Confluence"],
    shotLabel: "Coke Buddy · Thailand",
    shot: "/shots/salescode-coke-buddy.png",
  },
  {
    id: "integration",
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
    shotLabel: "Integration architecture",
  },
  {
    id: "incident",
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
    shotLabel: "Incident → resolution",
  },
];

/** AI in delivery — concrete, not a pipeline. */
export const aiExamples = [
  "Turning a raw integration payload into a clean data contract with validation.",
  "Sanity-checking SQL before it runs anywhere near production.",
  "Turning messy meeting notes into an architecture doc someone can actually follow.",
  "A small internal copilot that remembers project context so I don't have to.",
];

/* ── Personal — the vibe ─────────────────────────────────────────────── */
export const personalIntro =
  "Off the clock I still can't leave a problem half-solved. Each of these started as one specific itch, and I kept going until it covered the whole use case — not a side-project sketch, something built the way the market actually needs it.";

/* ── Vision / approach — the way I think ─────────────────────────────── */
export const vision = {
  lead: "I get deep into the problem first.",
  body:
    "Only after that do I look for something existing that solves it — and I'll use it happily if it does. Most of the time it half-solves it, so I build the rest. What I'm chasing is the best answer the market hasn't shipped yet, not the fastest one.",
  thread:
    "It's why every project here is narrow on purpose. Each one covers a single use case completely, as its own product, instead of being a feature bolted onto something bigger.",
};

export const interests = [
  "AI & context engineering", "Enterprise architecture", "Operating systems", "Knowledge management",
  "Distributed systems", "Supply chains", "Product design", "Learning fast",
];

/* ── Curated GitHub — richer cards ───────────────────────────────────── */
export type RepoCard = { name: string; group: string; purpose: string; shows: string; stack: string; featured?: boolean };
export const repoCards: RepoCard[] = [
  { name: "piku", group: "AI", purpose: "Ambient AI operating system — local-first, persistent memory.", shows: "World models, retrieval, agent orchestration", stack: "Tauri · Rust · Ollama", featured: true },
  { name: "relive-cure", group: "Product", purpose: "Agent Console for organic marketing + CRM Analytics for clinic lead ops — both in production.", shows: "AI agents, content pipeline, funnel & rep performance", stack: "React · Node · Postgres · Gemini", featured: true },
  { name: "mandibhai", group: "Product", purpose: "B2B wholesaler–retailer ordering — architecture showcase.", shows: "Inventory, pricing, order workflows", stack: "NestJS · Next.js", featured: true },
  { name: "mitra-friend-only-messaging", group: "Product", purpose: "Friend-request-only messaging with backend-enforced moderation.", shows: "Trust boundaries, API enforcement", stack: "TypeScript · CometChat" },
  { name: "lasik-consultation-bot", group: "Systems", purpose: "WhatsApp consultation qualifier — ReliveCure stack.", shows: "Messaging as a production channel", stack: "Node · WhatsApp" },
  { name: "lead-scoring-dashboard", group: "Systems", purpose: "Lead-scoring + SLA assignment — ReliveCure adjacent.", shows: "Business rules in code, SLA bands", stack: "Python · Streamlit" },
];

/* ── PERSONAL — Explorations of how I think ──────────────────────────── */

export type Build = {
  index: string;
  name: string;
  status: string;
  live?: boolean;
  tagline: string;
  body: string;
  themes: string[];
  shot?: string;
};

export const builds: Build[] = [
  {
    index: "X-01",
    name: "PIKU",
    status: "Building",
    tagline: "The operating system I wish existed.",
    body:
      "I got tired of re-explaining myself to a chatbot every session, so I'm building the opposite: something local-first that actually remembers — a running model of what I'm doing, thinking about, and learning, that I get to keep.",
    themes: ["Memory", "Identity", "Context", "Knowledge", "Reasoning", "Local AI", "Ambient intelligence", "Agent orchestration"],
  },
  {
    index: "X-02",
    name: "Relive Cure",
    status: "Live",
    live: true,
    tagline: "I built software to run a real business — and I run it.",
    body:
      "A LASIK clinic and the system that operates it, both mine. I see the patients and the leads. I improve the workflows, ship the features, and own the business process and the software at the same time. That combination is the point.",
    themes: ["Business ownership", "Operations", "Lead workflows", "WhatsApp CRM", "Automation", "Ship daily"],
  },
  {
    index: "X-03",
    name: "MandiBhai",
    status: "Building now",
    tagline: "Same-day wholesale, from the mandi to the shop.",
    body:
      "A wholesaler-to-retailer commerce solution I'm building: wholesalers sell, retailers buy at wholesale prices and get the stuff the same day. It pulls the wholesalers from the local mandi and shapes the whole flow — pricing, inventory, fulfilment — around that one promise.",
    themes: ["Wholesale", "Retail", "Same-day fulfilment", "Pricing", "Inventory", "Local mandi", "Commerce"],
  },
];

export const reliveCase = {
  rows: [
    { k: "Role", v: "Founder, operator and sole engineer. I see the patient funnel and the codebase in the same glance." },
    { k: "Own", v: "The business process and the software. I see patients, work leads, improve the workflows, and ship the features that fix what I just felt as an operator." },
    { k: "Build", v: "A WhatsApp CRM with an AI operator — fallback chains, shadow mode — lead scoring with SLA bands, and an 8,800-line command center I open every day." },
    { k: "Why it matters", v: "If a workflow annoys me at 9am as the operator, I've usually shipped the fix by that evening — same person, no handoff, no ticket." },
  ],
  metrics: [
    { n: "Live", l: "in production" },
    { n: "8,800", l: "line operator UI" },
    { n: "5", l: "reps run on it" },
    { n: "100+", l: "security commits" },
  ],
};

/* ── How both worlds feed each other ─────────────────────────────────── */

export const loop = {
  professional: ["Real constraints", "Stakeholder management", "Production systems", "Scale", "Business processes", "Reliability", "Governance", "Deployments", "Customers"],
  personal: ["Curiosity", "Experimentation", "AI", "New architectures", "System design", "Operating systems", "Interfaces", "Rapid iteration", "Creative engineering"],
};

/* ── Ways of thinking ────────────────────────────────────────────────── */

export const principles = [
  "Everything is a system.",
  "Architecture before implementation.",
  "Business before technology.",
  "Integrations are where systems meet.",
  "The best software disappears into operations.",
  "Technology should remove complexity, not create it.",
  "I don't build features. I build capabilities.",
];

/* ── Operating timeline — evolution, not employment history ───────────── */

export const timeline = [
  { t: "CAW Studios", d: "Where the craft started — building, shipping, learning the shape of real software." },
  { t: "Automation", d: "Finding the leverage: the manual processes that should have been systems." },
  { t: "Enterprise Delivery", d: "Owning implementation — discovery, integration, go-live, support." },
  { t: "International Implementations", d: "Coca-Cola across Thailand, the Philippines and North India. Scale and local constraints." },
  { t: "AI Systems", d: "AI as a delivery multiplier and an architectural primitive." },
  { t: "PIKU", d: "The system I wish existed — a personal operating layer." },
  { t: "Future", d: "Someone companies trust to own an entire system." },
];

/* ── Curated GitHub — grouped by what supports the story ──────────────── */

export const repoGroups = [
  { group: "AI", repos: ["piku"] },
  { group: "Automation", repos: ["lasik-consultation-bot", "lead-scoring-dashboard"] },
  { group: "Personal", repos: ["relive-cure", "mitra-friend-only-messaging"] },
];

/* ── Voice — first-person, specific, no corporate filler ──────────────────
   Written by Jaskirat, from his own account of how he actually works.
   `tag` marks the natural home for each; the anchor quote stands alone. */

export const anchorQuote =
  "I don't think of myself as just a developer anymore. I spend my day moving between " +
  "business conversations, architecture diagrams, SQL queries, API payloads, production " +
  "incidents, stakeholder presentations, AI tools, and customer workshops. Somewhere in the " +
  "middle of all that is the actual system I'm trying to make work.";

export type VoiceQuote = { tag: string; text: string };

export const voiceQuotes: VoiceQuote[] = [
  {
    tag: "salescode",
    text: "I realized pretty early that most enterprise projects don't fail because the API is broken. They fail because three teams think the same field means three different things. Half of my job at Salescode became sitting with Coca-Cola stakeholders in Thailand, understanding how they actually worked, then translating that into something engineering could build without guessing.",
  },
  {
    tag: "approach",
    text: "I'm usually the person who asks annoying questions in meetings. “What happens if this API is down?” “Who owns this data?” “Where does this field come from?” People sometimes think I'm slowing things down, but those are the questions that save three weeks of production debugging later.",
  },
  {
    tag: "incident",
    text: "When production breaks, I don't immediately open the code. I open logs, SQL, Kafka events, payloads, CloudWatch, compare timestamps, and try to reconstruct what actually happened. By the time I open the IDE, I already have a theory.",
  },
  {
    tag: "relive",
    text: "Relive Cure changed how I build software. It's one thing to build a CRM. It's another to build a CRM that five people actually use every day while patients are waiting for callbacks. If something is confusing, I'm the one who feels it first because I'm operating the business too.",
  },
  {
    tag: "ai",
    text: "I use AI every single day, but mostly for work people don't want to admit they spend hours doing. Requirement breakdowns. Architecture documents. SQL drafts. Payload comparisons. API debugging. Documentation. Meeting summaries. AI doesn't replace my thinking. It gets the repetitive work out of my way so I can spend time solving the actual problem.",
  },
  {
    tag: "piku",
    text: "PIKU started because I got frustrated with every AI forgetting everything after every conversation. I didn't want another chatbot. I wanted something that builds a world model about me over years, remembers why decisions were made, and becomes another layer of my operating system.",
  },
  {
    tag: "communicate",
    text: "I naturally think in diagrams. Someone explains a business process for five minutes and I'm already drawing systems, dependencies, APIs, actors, queues, failure points and edge cases. That's usually when I finally understand the problem.",
  },
  {
    tag: "hero",
    text: "The title says Senior Technical Project Development Associate. Most days it feels more like implementation consultant, business analyst, integration engineer, production support, customer success, solutions architect, and sometimes therapist for stakeholders who just want the project to go live.",
  },
  {
    tag: "path",
    text: "I enjoy the messy part of projects. Incomplete requirements. Legacy ERPs. APIs with undocumented behavior. Production issues at 7 PM. Those are usually the problems nobody wants, and they're usually the ones where I learn the most.",
  },
  {
    tag: "builder",
    text: "I've probably spent as much time inside SQL and Postman as I have inside an IDE. When data doesn't match, an order disappears, or a customer says “this worked yesterday,” I want to see exactly what the system believed happened before I touch any code.",
  },
  {
    tag: "loop",
    text: "I don't really separate business from engineering anymore. Whether it's Coca-Cola's ordering platform, a WhatsApp CRM for my LASIK clinic, or a wholesale marketplace, I end up asking the same questions: who uses it, what breaks, who owns the data, how does it fail. The code comes after those answers.",
  },
  {
    tag: "personal",
    text: "One thing I've noticed about myself is that I keep building tools for myself. Playbooks. Documentation. AI copilots. Knowledge bases. Scripts. Dashboards. If I have to do something twice, I start thinking about how to make sure nobody has to do it a third time.",
  },
];

export function quoteFor(tag: string): string | undefined {
  return voiceQuotes.find((q) => q.tag === tag)?.text;
}

/* ── Recruiter quick-read — the 20-second version ─────────────────────── */

export const recruiterCard = {
  role: "Consultant & Systems Builder — discovery, enterprise implementation, integration, AI-assisted delivery",
  lookingFor: ["Consultant", "Implementation Consultant", "Solutions Engineer", "Forward Deployed Engineer", "AI Product / Integration"],
  proof: [
    "3 countries live — Coca-Cola retail-execution rollout (Salescode.ai)",
    "8,800-line production system I built and operate daily (Relive Cure)",
    "Root-cause depth: SQL, Kafka, API, production support — not just requirements",
  ],
  basedIn: "Gurugram, India — open to remote / onsite",
};
