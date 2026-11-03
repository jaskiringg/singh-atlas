import { appendEvent } from "@/lib/analytics-store";
import { buildOrbMeta } from "@/lib/orb-confidence";
import { detectOrbExtras } from "@/lib/orb-extras";
import { buildOrbSystemPrompt } from "@/lib/orb-context";
import { detectOrbMode, isSimpleGreeting } from "@/lib/orb-modes";
import { maybeAppendMemoryCard } from "@/lib/orb-memory-cards";
import {
  greetingReplyAsMe,
  contactReplyAsMe,
  isContactInfoRequest,
  sanitizeOrbReply,
  shouldShowMeta,
} from "@/lib/orb-response";
import { isPrivateInfoRequest, privateInfoReplyAsMe } from "@/lib/orb-privacy";
import { chatOpenRouter, formatOpenRouterError } from "@/lib/openrouter";
import { chatGemini, formatGeminiError } from "@/lib/gemini";

type OrbMessage = { role: "user" | "assistant"; text: string };

export async function POST(req: Request) {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const hasOpenRouter = Boolean(openRouterKey) && openRouterKey !== "your_openrouter_api_key_here";

  if (!geminiKey && !hasOpenRouter) {
    return Response.json(
      {
        error: "missing_api_key",
        message: "The orb is offline right now — email me directly and you'll reach the actual human.",
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

  if (isPrivateInfoRequest(userText)) {
    const text = privateInfoReplyAsMe();
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
    let rawText: string;
    if (geminiKey) {
      try {
        ({ text: rawText } = await chatGemini(geminiKey, chatMessages, {
          model: process.env.GEMINI_MODEL,
        }));
      } catch (geminiErr) {
        if (!hasOpenRouter) throw geminiErr;
        console.error("Gemini failed, falling back to OpenRouter:", geminiErr);
        ({ text: rawText } = await chatOpenRouter(openRouterKey as string, chatMessages, {
          model: process.env.OPENROUTER_MODEL,
          siteUrl,
        }));
      }
    } else {
      ({ text: rawText } = await chatOpenRouter(openRouterKey as string, chatMessages, {
        model: process.env.OPENROUTER_MODEL,
        siteUrl,
      }));
    }

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
    const raw = e instanceof Error ? e.message : "model request failed";
    const message = geminiKey ? formatGeminiError(raw) : formatOpenRouterError(raw);
    console.error("Orb route error:", raw);
    return Response.json({ error: "model_failed", message }, { status: 502 });
  }
}
