import { appendEvent } from "@/lib/analytics-store";
import { buildOrbMeta } from "@/lib/orb-confidence";
import { detectOrbExtras } from "@/lib/orb-extras";
import { buildOrbSystemPrompt } from "@/lib/orb-context";
import { detectOrbMode, isSimpleGreeting } from "@/lib/orb-modes";
import { maybeAppendMemoryCard } from "@/lib/orb-memory-cards";
import { greetingReplyAsMe, contactReplyAsMe, isContactInfoRequest, sanitizeOrbReply, shouldShowMeta } from "@/lib/orb-response";
import { chatOpenRouter } from "@/lib/openrouter";

type OrbMessage = { role: "user" | "assistant"; text: string };

export async function POST(req: Request) {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key || key === "your_openrouter_api_key_here") {
    return Response.json(
      {
        error: "missing_api_key",
        message: "Add OPENROUTER_API_KEY to .env.local and restart the dev server.",
      },
      { status: 503 },
    );
  }

  let messages: OrbMessage[];
  let sessionId: string | undefined;
  let visitorId: string | undefined;

  try {
    const body = await req.json();
    messages = body.messages;
    sessionId = body.sessionId;
    visitorId = body.visitorId;
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages required" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const lastUser = messages.findLast((m) => m.role === "user");
  if (lastUser && sessionId && visitorId) {
    await appendEvent({
      type: "orb_message",
      sessionId,
      visitorId,
      role: "user",
      text: lastUser.text,
    });
  }

  const userText = lastUser?.text ?? "";
  const mode = detectOrbMode(userText);

  if (isSimpleGreeting(userText)) {
    const text = greetingReplyAsMe();
    if (sessionId && visitorId) {
      await appendEvent({
        type: "orb_message",
        sessionId,
        visitorId,
        role: "assistant",
        text,
      });
    }
    return Response.json({ text });
  }

  if (isContactInfoRequest(userText)) {
    const text = contactReplyAsMe();
    if (sessionId && visitorId) {
      await appendEvent({
        type: "orb_message",
        sessionId,
        visitorId,
        role: "assistant",
        text,
      });
    }
    return Response.json({ text, extras: { suggestBooking: true } });
  }

  const { prompt: systemPrompt, askFirst } = await buildOrbSystemPrompt({
    userText,
    messages,
  });

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3456";
  const chatMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    })),
  ];

  try {
    const { text: rawText } = await chatOpenRouter(key, chatMessages, {
      model: process.env.OPENROUTER_MODEL,
      siteUrl,
    });

    const { text } = sanitizeOrbReply(rawText, { askFirst, userText });
    const meta = shouldShowMeta(userText, text, mode) ? buildOrbMeta(userText, mode) : undefined;

    if (sessionId && visitorId) {
      await appendEvent({
        type: "orb_message",
        sessionId,
        visitorId,
        role: "assistant",
        text,
      });
    }

    const extras = lastUser ? detectOrbExtras(lastUser.text) : undefined;
    const hasExtras = extras && (extras.showResume || extras.flowchart || extras.suggestBooking);

    if (lastUser && text && !askFirst) {
      void maybeAppendMemoryCard({
        userText: lastUser.text,
        assistantText: text,
        flowchart: extras?.flowchart,
      }).catch((err) => console.error("Memory card append failed:", err));
    }

    const payload = hasExtras ? { text, ...(meta && { meta }), extras } : meta ? { text, meta } : { text };
    return Response.json(payload);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "model request failed";
    console.error("Orb route error:", msg);
    return Response.json({ error: "model_failed", message: msg }, { status: 502 });
  }
}
