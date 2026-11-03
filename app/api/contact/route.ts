import { randomUUID } from "crypto";
import { appendEvent } from "@/lib/analytics-store";
import { saveLead, type Lead } from "@/lib/leads-store";
import { notifyNewLead } from "@/lib/notify";

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

    const lead: Lead = {
      id: randomUUID(),
      ts: Date.now(),
      sessionId,
      visitorId,
      name: typeof name === "string" ? name.trim() || undefined : undefined,
      email: emailStr || undefined,
      phone: phoneStr || undefined,
      note: typeof note === "string" ? note.trim() || undefined : undefined,
    };

    // Postgres is the durable copy; the analytics event is a local mirror that
    // survives only until the container restarts.
    const stored = await saveLead(lead);
    await appendEvent({
      type: "contact_request",
      sessionId,
      visitorId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      note: lead.note,
    });

    // Never let a failed alert cost the visitor their submission.
    void notifyNewLead(lead).catch((err) => console.error("Lead alert failed:", err));

    if (!stored) {
      console.error("Connect request not persisted to Postgres:", lead.id);
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
