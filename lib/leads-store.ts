import { Pool } from "pg";

export type Lead = {
  id: string;
  ts: number;
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  sessionId?: string;
  visitorId?: string;
};

const CONNECTION = process.env.DATABASE_URL?.trim();

/** Railway's internal Postgres does not present a verifiable cert; external hosts do. */
function sslFor(url: string) {
  return /railway\.internal|localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false };
}

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!CONNECTION) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: CONNECTION,
      ssl: sslFor(CONNECTION),
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
    pool.on("error", (err) => console.error("Leads pool error:", err.message));
  }
  return pool;
}

export function leadsDbConfigured(): boolean {
  return Boolean(CONNECTION);
}

let ensured: Promise<void> | null = null;
/** Own table, own namespace — this database is shared with other services. */
function ensureTable(p: Pool): Promise<void> {
  if (!ensured) {
    ensured = p
      .query(
        `CREATE TABLE IF NOT EXISTS portfolio_leads (
           id          TEXT PRIMARY KEY,
           created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
           name        TEXT,
           email       TEXT,
           phone       TEXT,
           note        TEXT,
           session_id  TEXT,
           visitor_id  TEXT
         )`,
      )
      .then(() => {
        /* created or already present */
      })
      .catch((err) => {
        ensured = null;
        throw err;
      });
  }
  return ensured;
}

/** Returns true when the row is durably stored. Never throws — a failed write
 *  must not lose the submission, so the caller still has the analytics event. */
export async function saveLead(lead: Lead): Promise<boolean> {
  const p = getPool();
  if (!p) return false;
  try {
    await ensureTable(p);
    await p.query(
      `INSERT INTO portfolio_leads (id, created_at, name, email, phone, note, session_id, visitor_id)
       VALUES ($1, to_timestamp($2 / 1000.0), $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [lead.id, lead.ts, lead.name ?? null, lead.email ?? null, lead.phone ?? null, lead.note ?? null, lead.sessionId ?? null, lead.visitorId ?? null],
    );
    return true;
  } catch (err) {
    console.error("saveLead failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function listLeads(limit = 200): Promise<Lead[]> {
  const p = getPool();
  if (!p) return [];
  try {
    await ensureTable(p);
    const { rows } = await p.query(
      `SELECT id, created_at, name, email, phone, note, session_id, visitor_id
         FROM portfolio_leads
        ORDER BY created_at DESC
        LIMIT $1`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.id as string,
      ts: new Date(r.created_at as string | Date).getTime(),
      name: r.name ?? undefined,
      email: r.email ?? undefined,
      phone: r.phone ?? undefined,
      note: r.note ?? undefined,
      sessionId: r.session_id ?? undefined,
      visitorId: r.visitor_id ?? undefined,
    }));
  } catch (err) {
    console.error("listLeads failed:", err instanceof Error ? err.message : err);
    return [];
  }
}
