import { appendEvent } from "@/lib/analytics-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorId, path, referrer } = body;
    if (!visitorId || typeof visitorId !== "string") {
      return Response.json({ error: "visitorId required" }, { status: 400 });
    }
    await appendEvent({
      type: "pageview",
      visitorId,
      path: typeof path === "string" ? path : "/",
      referrer: typeof referrer === "string" ? referrer : "",
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
