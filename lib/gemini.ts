import type { ChatMessage } from "@/lib/openrouter";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** Tried in order. Google retires model ids with a 404 that names the replacement. */
export const GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
] as const;

type GeminiPart = { text?: string; thought?: boolean };

type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  error?: { message?: string; code?: number; status?: string };
};

/** Reasoning models return thought parts alongside the answer — keep only the answer. */
function extractText(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("")
    .trim();
}

function toGeminiBody(messages: ChatMessage[]) {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  return {
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
    contents,
    generationConfig: { maxOutputTokens: 700, temperature: 0.7 },
  };
}

async function callGemini(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<{ ok: true; text: string } | { ok: false; status: number; body: string }> {
  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
    body: JSON.stringify(toGeminiBody(messages)),
  });

  const body = await res.text();
  if (!res.ok) return { ok: false, status: res.status, body };

  let data: GeminiResponse;
  try {
    data = JSON.parse(body);
  } catch {
    return { ok: false, status: 502, body: "invalid JSON from Gemini" };
  }

  const text = extractText(data);
  if (!text) return { ok: false, status: 502, body: "empty response from model" };
  return { ok: true, text };
}

export async function chatGemini(
  apiKey: string,
  messages: ChatMessage[],
  options?: { model?: string },
): Promise<{ text: string; model: string }> {
  const preferred = options?.model?.trim();
  const models = preferred
    ? [preferred, ...GEMINI_MODELS.filter((m) => m !== preferred)]
    : [...GEMINI_MODELS];

  let lastError = "unknown error";

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await callGemini(apiKey, model, messages);
      if (result.ok) return { text: result.text, model };

      lastError = result.body;
      console.error(`Gemini error (${model}, attempt ${attempt + 1}, ${result.status}):`, lastError.slice(0, 300));

      // 503 is transient load; retry the same model once. Everything else moves on.
      if (result.status === 503 && attempt === 0) {
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }
      break;
    }
  }

  throw new Error(lastError);
}

/** Visitor-safe error text — never dump raw JSON in the UI. */
export function formatGeminiError(raw: string): string {
  let msg = raw;
  let status = "";
  try {
    const parsed = JSON.parse(raw) as GeminiResponse;
    msg = parsed.error?.message ?? raw;
    status = parsed.error?.status ?? "";
  } catch {
    /* raw is not JSON — use it as-is */
  }

  if (status === "RESOURCE_EXHAUSTED" || /quota|rate limit/i.test(msg)) {
    return "I've hit today's usage cap — email me directly and you'll reach the actual human.";
  }
  if (status === "UNAVAILABLE" || /high demand/i.test(msg)) {
    return "The model is busy right now — give it a few seconds and ask again.";
  }
  if (/empty response/i.test(msg)) {
    return "That came back blank — try rephrasing, or email me directly.";
  }
  return "I can't reach the model right now — try again in a moment, or email me directly.";
}
