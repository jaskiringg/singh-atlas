const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Free models that currently return text on OpenRouter (verified periodically). */
export const FREE_MODELS = [
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const;

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type OpenRouterMessage = {
  content?: string | null;
  reasoning?: string;
  reasoning_content?: string;
};

type OpenRouterErrorBody = {
  error?: {
    message?: string;
    code?: number;
    metadata?: { retry_after_seconds?: number };
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractAssistantText(message: OpenRouterMessage | undefined): string {
  if (!message) return "";
  const content = message.content?.trim();
  if (content) return content;
  return (message.reasoning ?? message.reasoning_content ?? "").trim();
}

function parseErrorBody(raw: string): OpenRouterErrorBody | null {
  try {
    return JSON.parse(raw) as OpenRouterErrorBody;
  } catch {
    return null;
  }
}

/** Visitor-safe error text — never dump raw JSON in the UI. */
export function formatOpenRouterError(raw: string): string {
  const parsed = parseErrorBody(raw);
  const msg = parsed?.error?.message ?? raw;
  const code = parsed?.error?.code;

  if (code === 429 || /rate-?limit/i.test(msg)) {
    return "Free models are busy right now — try again in a minute, or email me directly.";
  }
  if (code === 404 || /no endpoints found/i.test(msg)) {
    return "The AI backend rotated free models — retrying should work in a moment.";
  }
  if (code === 502 || code === 503) {
    return "The model provider hiccuped — try again in a moment.";
  }
  if (/empty response/i.test(msg)) {
    return "Got a blank model reply — try again or email me directly.";
  }
  return "Couldn't reach the model right now — try again in a moment, or email me directly.";
}

async function callModel(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  siteUrl: string,
): Promise<{ ok: true; text: string } | { ok: false; status: number; body: string }> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-Title": "Jaskirat Singh Systems",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 380,
      temperature: 0.7,
      include_reasoning: false,
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, body };
  }

  let data: { choices?: { message?: OpenRouterMessage }[] };
  try {
    data = JSON.parse(body);
  } catch {
    return { ok: false, status: 502, body: "invalid JSON from OpenRouter" };
  }

  const text = extractAssistantText(data?.choices?.[0]?.message);
  if (!text) {
    return { ok: false, status: 502, body: "empty response from model" };
  }
  return { ok: true, text };
}

export async function chatOpenRouter(
  apiKey: string,
  messages: ChatMessage[],
  options?: { model?: string; siteUrl?: string },
): Promise<{ text: string; model: string }> {
  const siteUrl = options?.siteUrl ?? "http://localhost:3456";
  const preferred = options?.model?.trim();
  const models = preferred
    ? [preferred, ...FREE_MODELS.filter((m) => m !== preferred)]
    : [...FREE_MODELS];

  let lastError = "unknown error";

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await callModel(apiKey, model, messages, siteUrl);
      if (result.ok) {
        return { text: result.text, model };
      }

      lastError = result.body;
      console.error(`OpenRouter error (${model}, attempt ${attempt + 1}):`, lastError);

      const parsed = parseErrorBody(result.body);
      const retryable = [404, 429, 502, 503].includes(result.status);
      if (!retryable) break;

      const waitSec = parsed?.error?.metadata?.retry_after_seconds;
      if (result.status === 429 && typeof waitSec === "number" && attempt === 0) {
        await sleep(Math.min(Math.ceil(waitSec * 1000), 15_000));
        continue;
      }
      break;
    }
  }

  throw new Error(lastError);
}
