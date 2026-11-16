import { NextResponse } from "next/server";
import { LAB_DISCLAIMER, SAMPLE_ORDER, submitMockOrder, type MockOrderBody } from "@/lib/lab-mock";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    mock: true,
    note: LAB_DISCLAIMER,
    method: "POST",
    path: "/api/lab/orders",
    publicShape: "POST /v2/orders — portfolio source shape, not a bottler extract",
    sample: SAMPLE_ORDER,
  });
}

export async function POST(req: Request) {
  let body: MockOrderBody = {};
  try {
    body = (await req.json()) as MockOrderBody;
  } catch {
    return NextResponse.json({ mock: true, note: LAB_DISCLAIMER, accepted: false, errors: ["Invalid JSON"] }, { status: 400 });
  }
  const result = submitMockOrder(body);
  return NextResponse.json(result, { status: result.status });
}
