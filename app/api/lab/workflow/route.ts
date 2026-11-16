import { NextResponse } from "next/server";
import { LAB_DISCLAIMER, WORKFLOW_SCENARIOS, runVoiceWorkflow } from "@/lib/lab-mock";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    mock: true,
    note: LAB_DISCLAIMER,
    scenarios: WORKFLOW_SCENARIOS,
  });
}

export async function POST(req: Request) {
  let scenario = "qualify";
  try {
    const body = (await req.json()) as { scenario?: string };
    scenario = String(body.scenario ?? "qualify");
  } catch {
    scenario = "qualify";
  }
  const allowed = WORKFLOW_SCENARIOS.some((s) => s.id === scenario);
  if (!allowed) {
    return NextResponse.json({ mock: true, note: LAB_DISCLAIMER, error: "Unknown scenario" }, { status: 400 });
  }
  return NextResponse.json(runVoiceWorkflow(scenario));
}
