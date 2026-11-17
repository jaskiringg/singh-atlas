import { NextResponse } from "next/server";
import { EXAMPLE_QUERIES, LAB_DISCLAIMER, LAB_TABLES, runMockSql } from "@/lib/lab-mock";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    mock: true,
    note: LAB_DISCLAIMER,
    tables: Object.fromEntries(
      Object.entries(LAB_TABLES).map(([name, table]) => [name, { columns: table.columns, rowCount: table.rows.length }]),
    ),
    examples: EXAMPLE_QUERIES,
  });
}

export async function POST(req: Request) {
  let sql = "";
  try {
    const body = (await req.json()) as { sql?: string };
    sql = String(body.sql ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "JSON body with { sql } required.", mock: true, note: LAB_DISCLAIMER }, { status: 400 });
  }
  const result = runMockSql(sql);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
