const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Free models only — user's OpenRouter key, zero paid tier required. */
export const FREE_MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
] as const;

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type OpenRouterMessage = {
  content?: string;
  reasoning?: string;
  reasoning_content?: string;
};

function extractAssistantText(message: OpenRouterMessage | undefined): string {
  if (!message) return "";
  return message.content?.trim() ?? "";
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

    if (res.ok) {
      const data = await res.json();
      const text = extractAssistantText(data?.choices?.[0]?.message);
      if (text) return { text, model };
      lastError = "empty response from model";
      continue;
    }

    lastError = await res.text();
    console.error(`OpenRouter error (${model}):`, lastError);
    if (![404, 429, 502, 503].includes(res.status)) break;
  }

  throw new Error(lastError);
}
