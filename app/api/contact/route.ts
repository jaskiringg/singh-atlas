import { appendEvent } from "@/lib/analytics-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, visitorId, name, email, phone, note } = body;

    if (!sessionId || !visitorId) {
      return Response.json({ error: "sessionId and visitorId required" }, { status: 400 });
    }

    const emailStr = typeof email === "string" ? email.trim() : "";
    const phoneStr = typeof phone === "string" ? phone.trim() : "";

    if (!emailStr && !phoneStr) {
      return Response.json({ error: "email or phone required" }, { status: 400 });
    }

    if (emailStr && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      return Response.json({ error: "invalid email" }, { status: 400 });
    }

    await appendEvent({
      type: "contact_request",
      sessionId,
      visitorId,
      name: typeof name === "string" ? name.trim() || undefined : undefined,
      email: emailStr || undefined,
      phone: phoneStr || undefined,
      note: typeof note === "string" ? note.trim() || undefined : undefined,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
