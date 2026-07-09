import { appendEvent } from "@/lib/analytics-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, visitorId } = body;
    if (!sessionId || !visitorId) {
      return Response.json({ error: "sessionId and visitorId required" }, { status: 400 });
    }
    await appendEvent({ type: "orb_open", sessionId, visitorId });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
