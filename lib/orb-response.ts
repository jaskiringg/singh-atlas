import type { OrbMode } from "@/lib/orb-modes";
import { isSimpleGreeting } from "@/lib/orb-modes";

export type OrbLens = "engineer" | "consultant" | "founder";
export type OrbConfidence = "very high" | "high" | "medium" | "low";

export type OrbMeta = {
  lenses: OrbLens[];
  confidence: OrbConfidence;
};

export type ParsedOrbReply = {
  text: string;
  meta?: OrbMeta;
};

const META_TAG_RE = /<orb_meta>[\s\S]*?<\/orb_meta>\s*/gi;
const THINK_BLOCK_RE = /<(?:think|redacted_reasoning)>[\s\S]*?<\/(?:think|redacted_reasoning)>\s*/gi;

const LEAK_LINE_RE =
  /^(okay|ok|alright|sure|right|so)[,.]?\s+(the user|so the user|they(?:'re| are)|looking at|let me|i notice)/i;

const LEAK_PHRASE_RE =
  /\b(the user (is|seems|was|has|asked)|they seem|visitor (is|seems)|looking back at my experience|from the memory cards|i recall from|based on (the|this) (question|query|prompt)|let me (think|consider|break this down)|i need to (respond|answer)|previous (attempt|message)|system prompt|memory retrieval|scratchpad|reasoning tokens)\b/i;

const GENERIC_AI_RE: [RegExp, string][] = [
  [/\bas an ai\b/gi, ""],
  [/\bi'?d be happy to\b/gi, ""],
  [/\bgreat question[!.,]?\s*/gi, ""],
  [/\bcertainly[!.,]?\s*/gi, ""],
  [/\babsolutely[!.,]?\s*/gi, ""],
  [/\bi hope this helps[!.]?\s*/gi, ""],
  [/\bfeel free to ask\b/gi, ""],
  [/\bhi!?\s+i'?m an ai version of jaskirat\b/gi, ""],
  [/\bhey there[!.,]?\s*/gi, "Hey. "],
  [/\bi'?m all ears[!.]?\s*/gi, ""],
  [/\bwrestling with\b/gi, "stuck on"],
  [/\bwhat are you building or wrestling with today\b/gi, "what are you building"],
  [/\*\*([^*]+)\*\*/g, "$1"],
];

const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

/** Deterministic reply for hi/hello — free models won't nail voice; we will. */
export function greetingReplyAsMe(): string {
  return "Hey. What are you building — or where are you stuck?";
}

export function shouldShowMeta(userText: string, replyText: string, mode: OrbMode): boolean {
  if (mode === "greeting" || isSimpleGreeting(userText)) return false;
  return replyText.length >= 70;
}

const CLARIFY_FALLBACKS: { re: RegExp; q: string }[] = [
  {
    re: /\b(voice|roi)\b/i,
    q: "Depends — internal operations, customer support, or sales? Those have completely different math.",
  },
  { re: /\bkafka|messaging|event\b/i, q: "Maybe — but what operational problem are you solving with messaging?" },
  {
    re: /\bkubernetes|k8s\b/i,
    q: "What failure mode are you trying to solve — multi-service orchestration, or just deployment discipline?",
  },
  {
    re: /\bmicroservice/i,
    q: "How many teams own how many deployables? That usually decides monolith vs split.",
  },
  {
    re: /\broi\b/i,
    q: "ROI for whom — the company, the employee, or the customer? Those numbers can be completely different.",
  },
];

function isLeakedParagraph(p: string): boolean {
  const t = p.trim();
  if (!t) return true;
  if (LEAK_LINE_RE.test(t)) return true;
  if (LEAK_PHRASE_RE.test(t)) return true;
  return false;
}

function collapseBullets(text: string): string {
  const lines = text.split("\n");
  const bulletCount = lines.filter((l) => /^\s*[-*•]\s/.test(l)).length;
  if (bulletCount < 5) return text;
  return lines
    .map((l) => l.replace(/^\s*[-*•]\s+/, ""))
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Deterministic style cleanup — no generic AI voice. */
export function enforceStyle(text: string): string {
  let out = text.replace(EMOJI_RE, "");
  for (const [re, rep] of GENERIC_AI_RE) out = out.replace(re, rep);
  out = collapseBullets(out);
  out = out.replace(/\n{3,}/g, "\n\n").replace(/^\s+/, "").trim();
  out = out.replace(/^[,.\s]+/, "");
  if (out) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

/** If we needed a clarifying question but the model lectured, substitute one. */
export function enforceAskFirst(userText: string, text: string, askFirst: boolean): string {
  if (!askFirst) return text;
  const trimmed = text.trim();
  if (trimmed.length < 120 && trimmed.endsWith("?")) return trimmed;
  for (const { re, q } of CLARIFY_FALLBACKS) {
    if (re.test(userText)) return q;
  }
  return "It depends — what's the business context? Internal ops, customer-facing, or something else?";
}

/** Strip model planning, thinking tags, and hidden meta from visitor-visible text. */
export function sanitizeOrbReply(raw: string, opts?: { askFirst?: boolean; userText?: string }): ParsedOrbReply {
  let text = raw.replace(THINK_BLOCK_RE, "").replace(META_TAG_RE, "").trim();

  const paragraphs = text.split(/\n{2,}/);
  const clean = paragraphs.filter((p) => !isLeakedParagraph(p));
  if (clean.length > 0) text = clean.join("\n\n").trim();

  const sentences = text.split(/(?<=[.!?])\s+/);
  while (sentences.length > 1 && isLeakedParagraph(sentences[0])) sentences.shift();
  text = sentences.join(" ").trim();

  if (opts?.askFirst && opts.userText) {
    text = enforceAskFirst(opts.userText, text, true);
  }

  text = enforceStyle(text);
  return { text };
}
