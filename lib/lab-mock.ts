/**
 * Engineering Lab — mock Coca-Cola-shaped data only.
 * Not a bottler extract. No production credentials. No live DBs.
 */

export const LAB_DISCLAIMER =
  "Mock data. Portfolio shape only — not a bottler extract, not production, no credentials.";

export type LabRow = Record<string, string | number | null>;

export type LabTable = {
  columns: string[];
  rows: LabRow[];
};

export const LAB_TABLES: Record<string, LabTable> = {
  ck_outlet_details: {
    columns: ["outlet_id", "outlet_name", "city", "channel", "status"],
    rows: [
      { outlet_id: "TH-4471", outlet_name: "Mock Mart Sukhumvit", city: "Bangkok", channel: "GT", status: "active" },
      { outlet_id: "TH-4488", outlet_name: "Mock Store Chiang Mai", city: "Chiang Mai", channel: "GT", status: "active" },
      { outlet_id: "PH-2201", outlet_name: "Mock Sari-Sari 12", city: "Manila", channel: "GT", status: "active" },
      { outlet_id: "IN-9104", outlet_name: "Mock Kirana North-04", city: "Gurugram", channel: "GT", status: "inactive" },
      { outlet_id: "TH-4502", outlet_name: "Mock Wholesaler Lat Phrao", city: "Bangkok", channel: "WS", status: "active" },
    ],
  },
  ck_productdetails: {
    columns: ["product_id", "sku", "brand", "pack_size", "list_price", "active"],
    rows: [
      { product_id: "SKU-COKE-500", sku: "COKE 500ml", brand: "Coca-Cola", pack_size: "24", list_price: 18.5, active: 1 },
      { product_id: "SKU-SPRITE-1L", sku: "SPRITE 1L", brand: "Sprite", pack_size: "12", list_price: 29.0, active: 1 },
      { product_id: "SKU-FANTA-500", sku: "FANTA 500ml", brand: "Fanta", pack_size: "24", list_price: 17.0, active: 1 },
      { product_id: "SKU-COKE-1.5", sku: "COKE 1.5L", brand: "Coca-Cola", pack_size: "12", list_price: 34.0, active: 0 },
    ],
  },
  ck_orders: {
    columns: ["order_id", "outlet_id", "product_id", "qty", "unit_price", "order_date", "status"],
    rows: [
      { order_id: "ORD-1001", outlet_id: "TH-4471", product_id: "SKU-COKE-500", qty: 24, unit_price: 18.5, order_date: "2026-10-12", status: "confirmed" },
      { order_id: "ORD-1002", outlet_id: "TH-4471", product_id: "SKU-SPRITE-1L", qty: 12, unit_price: 29.0, order_date: "2026-10-12", status: "confirmed" },
      { order_id: "ORD-1003", outlet_id: "TH-4488", product_id: "SKU-FANTA-500", qty: 48, unit_price: 17.0, order_date: "2026-10-14", status: "pending" },
      { order_id: "ORD-1004", outlet_id: "PH-2201", product_id: "SKU-COKE-500", qty: 12, unit_price: 18.5, order_date: "2026-10-15", status: "failed" },
      { order_id: "ORD-1005", outlet_id: "TH-4502", product_id: "SKU-COKE-1.5", qty: 36, unit_price: 34.0, order_date: "2026-10-16", status: "held" },
      { order_id: "ORD-1006", outlet_id: "IN-9104", product_id: "SKU-SPRITE-1L", qty: 6, unit_price: 29.0, order_date: "2026-10-18", status: "rejected" },
    ],
  },
  ck_sales: {
    columns: ["sale_id", "outlet_id", "product_id", "qty", "amount", "sale_date", "channel"],
    rows: [
      { sale_id: "S-8801", outlet_id: "TH-4471", product_id: "SKU-COKE-500", qty: 24, amount: 444.0, sale_date: "2026-10-12", channel: "DMS" },
      { sale_id: "S-8802", outlet_id: "TH-4471", product_id: "SKU-SPRITE-1L", qty: 12, amount: 348.0, sale_date: "2026-10-12", channel: "DMS" },
      { sale_id: "S-8803", outlet_id: "TH-4488", product_id: "SKU-FANTA-500", qty: 24, amount: 408.0, sale_date: "2026-10-13", channel: "DMS" },
      { sale_id: "S-8804", outlet_id: "PH-2201", product_id: "SKU-COKE-500", qty: 8, amount: 148.0, sale_date: "2026-10-15", channel: "SFA" },
      { sale_id: "S-8805", outlet_id: "TH-4502", product_id: "SKU-COKE-500", qty: 96, amount: 1776.0, sale_date: "2026-10-16", channel: "WS" },
    ],
  },
};

export const EXAMPLE_QUERIES = [
  "SELECT * FROM ck_orders",
  "SELECT outlet_id, city, channel, status FROM ck_outlet_details WHERE status = 'active'",
  "SELECT * FROM ck_sales WHERE channel = 'DMS' ORDER BY amount DESC",
  "SELECT product_id, sku, list_price FROM ck_productdetails WHERE active = 1",
  "SELECT * FROM ck_orders WHERE status = 'failed'",
];

const IDENT = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function stripSql(sql: string): string {
  return sql
    .replace(/--.*$/gm, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;+$/, "");
}

function parseValue(raw: string): string | number {
  const t = raw.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return t;
}

function cmp(rowVal: string | number | null, op: string, expected: string | number): boolean {
  if (rowVal === null) return false;
  if (op === "=" || op === "==") return String(rowVal) === String(expected);
  if (op === "!=") return String(rowVal) !== String(expected);
  if (typeof rowVal === "number" && typeof expected === "number") {
    if (op === ">") return rowVal > expected;
    if (op === "<") return rowVal < expected;
    if (op === ">=") return rowVal >= expected;
    if (op === "<=") return rowVal <= expected;
  }
  if (op === "like") {
    const pattern = String(expected).replace(/%/g, ".*").replace(/_/g, ".");
    return new RegExp(`^${pattern}$`, "i").test(String(rowVal));
  }
  return String(rowVal) === String(expected);
}

export type SqlOk = { ok: true; columns: string[]; rows: LabRow[]; table: string; mock: true; note: string };
export type SqlErr = { ok: false; error: string; mock: true; note: string };

export function runMockSql(input: string): SqlOk | SqlErr {
  const note = LAB_DISCLAIMER;
  const sql = stripSql(input);
  if (!sql) return { ok: false, error: "Empty query.", mock: true, note };
  if (/[;]/.test(sql)) return { ok: false, error: "One statement only.", mock: true, note };
  if (!/^select\b/i.test(sql)) return { ok: false, error: "SELECT only. This workbench does not mutate mock tables.", mock: true, note };
  if (/\b(insert|update|delete|drop|alter|truncate|create|grant|copy|into|union|attach)\b/i.test(sql)) {
    return { ok: false, error: "Write / DDL keywords are blocked.", mock: true, note };
  }

  const fromMatch = sql.match(/\bfrom\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i);
  if (!fromMatch) return { ok: false, error: "Missing FROM <table>.", mock: true, note };
  const table = fromMatch[1].toLowerCase();
  const catalog = LAB_TABLES[table];
  if (!catalog) {
    return {
      ok: false,
      error: `Unknown table '${table}'. Allowed: ${Object.keys(LAB_TABLES).join(", ")}.`,
      mock: true,
      note,
    };
  }

  const selectPart = sql.slice(6, fromMatch.index).trim();
  let columns: string[];
  if (selectPart === "*") {
    columns = [...catalog.columns];
  } else {
    columns = selectPart.split(",").map((c) => c.trim().toLowerCase());
    for (const col of columns) {
      if (!IDENT.test(col) || !catalog.columns.includes(col)) {
        return { ok: false, error: `Unknown column '${col}' on ${table}.`, mock: true, note };
      }
    }
  }

  let rows = catalog.rows.map((r) => ({ ...r }));

  const whereMatch = sql.match(/\bwhere\s+(.+?)(?:\border\s+by\b|\blimit\b|$)/i);
  if (whereMatch) {
    const clauses = whereMatch[1].split(/\band\b/i).map((c) => c.trim());
    for (const clause of clauses) {
      const m = clause.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(=|!=|>=|<=|>|<|like)\s*(.+)$/i);
      if (!m) return { ok: false, error: `Unsupported WHERE clause: ${clause}`, mock: true, note };
      const col = m[1].toLowerCase();
      if (!catalog.columns.includes(col)) return { ok: false, error: `Unknown column '${col}'.`, mock: true, note };
      const op = m[2].toLowerCase();
      const expected = parseValue(m[3]);
      rows = rows.filter((r) => cmp(r[col], op, expected));
    }
  }

  const orderMatch = sql.match(/\border\s+by\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+(asc|desc))?\b/i);
  if (orderMatch) {
    const col = orderMatch[1].toLowerCase();
    if (!catalog.columns.includes(col)) return { ok: false, error: `ORDER BY unknown column '${col}'.`, mock: true, note };
    const dir = (orderMatch[2] || "asc").toLowerCase() === "desc" ? -1 : 1;
    rows = [...rows].sort((a, b) => {
      const av = a[col];
      const bv = b[col];
      if (av === bv) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return av > bv ? dir : -dir;
    });
  }

  const limitMatch = sql.match(/\blimit\s+(\d+)\b/i);
  if (limitMatch) rows = rows.slice(0, Number(limitMatch[1]));

  rows = rows.map((r) => {
    const out: LabRow = {};
    for (const col of columns) out[col] = r[col] ?? null;
    return out;
  });

  return { ok: true, columns, rows, table, mock: true, note };
}

export type MockOrderLine = { productId: string; qty: number; price: number };
export type MockOrderBody = {
  outletId?: string;
  repId?: string;
  lines?: MockOrderLine[];
  promotion?: string;
  channel?: string;
};

export function submitMockOrder(body: MockOrderBody) {
  const note = LAB_DISCLAIMER;
  const errors: string[] = [];
  const outletId = String(body.outletId ?? "").trim();
  const repId = String(body.repId ?? "").trim();
  const lines = Array.isArray(body.lines) ? body.lines : [];
  const outlets = LAB_TABLES.ck_outlet_details.rows;
  const products = LAB_TABLES.ck_productdetails.rows;

  if (!outletId) errors.push("outletId is required");
  if (!repId) errors.push("repId is required");
  if (!lines.length) errors.push("lines[] must have at least one item");

  const outlet = outlets.find((r) => r.outlet_id === outletId);
  if (outletId && !outlet) errors.push(`outletId '${outletId}' is not in mock ck_outlet_details`);
  if (outlet && outlet.status !== "active") errors.push(`outlet ${outletId} is ${outlet.status} — would fail UAT hierarchy checks`);

  const validatedLines = lines.map((line, i) => {
    const product = products.find((p) => p.product_id === line.productId);
    const lineErrors: string[] = [];
    if (!product) lineErrors.push(`unknown productId`);
    if (product && product.active === 0) lineErrors.push("SKU inactive on mock master");
    if (!Number.isFinite(line.qty) || line.qty <= 0) lineErrors.push("qty must be > 0");
    if (!Number.isFinite(line.price) || line.price < 0) lineErrors.push("price invalid");
    if (lineErrors.length) errors.push(`lines[${i}] ${line.productId ?? "?"}: ${lineErrors.join("; ")}`);
    return {
      productId: line.productId,
      sku: product?.sku ?? null,
      qty: line.qty,
      price: line.price,
      listPrice: product?.list_price ?? null,
      ok: lineErrors.length === 0,
    };
  });

  const promo = body.promotion ?? null;
  const promoNote =
    promo === "BUY10_GET1"
      ? "Promo accepted in mock. Real UAT is where stacking and legacy SKU aliases fail."
      : promo
        ? "Unknown promo code — mock gateway would still accept and flag for pricing review."
        : "No promotion.";

  if (errors.length) {
    return {
      mock: true,
      note,
      accepted: false,
      status: 400,
      errors,
      validated: { outlet: outlet ?? null, lines: validatedLines, promotion: promoNote },
    };
  }

  const orderId = `MOCK-${Date.now().toString(36).toUpperCase()}`;
  return {
    mock: true,
    note,
    accepted: true,
    status: 201,
    orderId,
    channel: body.channel ?? "DMS",
    outletId,
    repId,
    lines: validatedLines,
    promotion: promoNote,
    next: ["gateway auth", "map + validate", "Kafka topic mock.order.accepted", "SQL reconcile against ck_orders"],
  };
}

export const ARCH_NODES = [
  { id: "erp", label: "ERP / DMS", sub: "source of outlet, product, price, stock" },
  { id: "gateway", label: "API gateway", sub: "auth · routing · rate limit" },
  { id: "integration", label: "Integration layer", sub: "field map · customer rules · delta" },
  { id: "kafka", label: "Kafka", sub: "platform bus — not infrastructure I built" },
  { id: "validate", label: "Validate", sub: "SQL reconcile · golden file · SIT" },
  { id: "postgres", label: "PostgreSQL", sub: "masters + transactions the platform trusts" },
  { id: "platform", label: "Salescode platform", sub: "ordering · field-sales — I implement on it" },
  { id: "monitor", label: "Monitoring", sub: "CloudWatch · logs · hypercare" },
] as const;

export type ArchEvent = {
  nodeId: (typeof ARCH_NODES)[number]["id"];
  t: string;
  title: string;
  detail: string;
};

export function runDeltaSimulation(): ArchEvent[] {
  return [
    { nodeId: "erp", t: "00.00s", title: "Source delta", detail: "Mock ERP emits product-master change SKU-COKE-1.5 active=0." },
    { nodeId: "gateway", t: "00.12s", title: "Accepted at gateway", detail: "Auth ok. Routed to integration. Rate-limit header remaining=48." },
    { nodeId: "integration", t: "00.40s", title: "Mapped", detail: "Source ACTIVE_FLAG 'N' → platform active=0. Customer rule: inactive SKUs cannot enter new orders." },
    { nodeId: "kafka", t: "00.61s", title: "Published", detail: "Topic mock.master.product.delta partition 2. I consume this bus; I did not build Kafka." },
    { nodeId: "validate", t: "01.08s", title: "SQL check", detail: "ck_productdetails.product_id='SKU-COKE-1.5' still active=1 — stale master. This is the UAT failure SIT missed." },
    { nodeId: "postgres", t: "01.33s", title: "Apply + flag", detail: "Update mock row active=0. Open replay window for in-flight ORD-1005." },
    { nodeId: "platform", t: "01.52s", title: "Field surface", detail: "Coke Buddy would stop offering the SKU. Held order needs pricing review, not a silent drop." },
    { nodeId: "monitor", t: "01.70s", title: "Hypercare", detail: "CloudWatch: consumer lag 0. Runbook: patch, replay, verify the field rep is green." },
  ];
}

export const WORKFLOW_SCENARIOS = [
  { id: "qualify", label: "Qualify the call" },
  { id: "escalate", label: "Partial capture → escalate" },
  { id: "promo", label: "Promo question from RAG" },
] as const;

export type WorkflowStep = {
  id: "call" | "stt" | "rag" | "qualification" | "response" | "outcome";
  label: string;
  layer: "telephony" | "engine" | "application";
  body: string;
  data?: Record<string, string>;
};

export function runVoiceWorkflow(scenario: string): { mock: true; note: string; steps: WorkflowStep[] } {
  const note =
    "Application-layer demo on mock audio. STT, TTS and the LLM are managed engines — this lab does not claim to be those engines.";

  const sharedCall: WorkflowStep = {
    id: "call",
    label: "Call",
    layer: "telephony",
    body: "Inbound mock call · 00:42 · outlet TH-4471 · rented telephony, not a stack I built.",
    data: { from: "+66-00-000-0000", outletId: "TH-4471", duration: "00:42" },
  };

  if (scenario === "escalate") {
    return {
      mock: true,
      note,
      steps: [
        sharedCall,
        {
          id: "stt",
          label: "STT",
          layer: "engine",
          body: "Mock transcript from a managed speech service: “I want to order… wait, the code is… hello? Can a person—” [partial]",
        },
        {
          id: "rag",
          label: "RAG",
          layer: "application",
          body: "Section-wise chunking returns the escalation policy, not the whole playbook.",
          data: { chunk: "If capture is partial after one restatement, transfer to a human. Do not guess SKUs." },
        },
        {
          id: "qualification",
          label: "Qualification",
          layer: "application",
          body: "Guardrail: do not invent a product or a price. Fields incomplete.",
          data: { outlet: "TH-4471", intent: "order", sku: "unknown", complete: "false" },
        },
        {
          id: "response",
          label: "Response",
          layer: "application",
          body: "Scripted application turn: “I’ll put you through to someone who can take the order. Stay on the line.” TTS is rented.",
        },
        {
          id: "outcome",
          label: "Outcome",
          layer: "application",
          body: "Outcome = escalated. Writeback to the same outlet record the DMS uses.",
          data: { outcome: "escalated", writeback: "mock.lead.events", reason: "partial_capture" },
        },
      ],
    };
  }

  if (scenario === "promo") {
    return {
      mock: true,
      note,
      steps: [
        sharedCall,
        {
          id: "stt",
          label: "STT",
          layer: "engine",
          body: "Mock transcript: “Does BUY10_GET1 stack with the wholesale rate on Coke 500?”",
        },
        {
          id: "rag",
          label: "RAG",
          layer: "application",
          body: "Retrieved the promo section, not the full price list.",
          data: {
            chunk: "BUY10_GET1 applies to GT case packs. It does not stack with WS wholesale rate. Confirm channel first.",
          },
        },
        {
          id: "qualification",
          label: "Qualification",
          layer: "application",
          body: "Channel on the outlet master is GT. Promo is allowed; stacking is not.",
          data: { channel: "GT", promo: "BUY10_GET1", stack: "false" },
        },
        {
          id: "response",
          label: "Response",
          layer: "application",
          body: "“That promo applies to your store packs. It doesn’t sit on top of the wholesale rate.” Guardrail: no invented discount.",
        },
        {
          id: "outcome",
          label: "Outcome",
          layer: "application",
          body: "Outcome = answered. No order created. Promo clarification logged on the outlet.",
          data: { outcome: "answered", writeback: "mock.outlet.notes" },
        },
      ],
    };
  }

  return {
    mock: true,
    note,
    steps: [
      sharedCall,
      {
        id: "stt",
        label: "STT",
        layer: "engine",
        body: "Mock transcript: “This is Mock Mart Sukhumvit. I need two cases of Coke 500 for tomorrow.”",
      },
      {
        id: "rag",
        label: "RAG",
        layer: "application",
        body: "Retrieved outlet hours + SKU pack rules for GT channel.",
        data: { chunk: "GT outlets order in case packs of 24. Same-day cutoff 16:00 local. SKU-COKE-500 is active." },
      },
      {
        id: "qualification",
        label: "Qualification",
        layer: "application",
        body: "Fields filled from transcript + masters. This is the application layer I actually own.",
        data: {
          outlet: "TH-4471",
          sku: "SKU-COKE-500",
          qty: "48",
          intent: "order",
          qualified: "true",
        },
      },
      {
        id: "response",
        label: "Response",
        layer: "application",
        body: "“Two cases of Coke 500, 48 units, for TH-4471. I’ll place that.” TTS rented; the confirmation rules are mine.",
      },
      {
        id: "outcome",
        label: "Outcome",
        layer: "application",
        body: "Outcome = qualified. Writeback a mock order intent the DMS can pick up.",
        data: { outcome: "qualified", writeback: "mock.order.intent", orderShape: "POST /v2/orders" },
      },
    ],
  };
}

export const SAMPLE_ORDER: MockOrderBody = {
  outletId: "TH-4471",
  repId: "emp_2093",
  lines: [
    { productId: "SKU-COKE-500", qty: 24, price: 18.5 },
    { productId: "SKU-SPRITE-1L", qty: 12, price: 29.0 },
  ],
  promotion: "BUY10_GET1",
  channel: "DMS",
};
