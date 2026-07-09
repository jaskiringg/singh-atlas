import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { FlowchartId } from "@/lib/orb-extras";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const CARDS_PATH = path.join(DATA_DIR, "orb-memory-cards.json");

export type OrbMemoryCard = {
  id: string;
  ts: number;
  topic: string;
  tags?: string[];
  observation?: string;
  responseThatWorked: string;
  usefulAnalogy?: string;
  userQuestion?: string;
  source: "seed" | "auto";
};

type CardStore = { cards: OrbMemoryCard[] };

const GREETING_RE = /^\s*(hi|hello|hey|sup|yo|thanks|thank you|thx|ok|okay)\b/i;

const LEAK_RE =
  /\b(okay, the user|they seem|looking back at my experience|from the memory cards|i recall from|let me think|based on (the|this) question)\b/i;

async function readStore(): Promise<CardStore> {
  try {
    const raw = await readFile(CARDS_PATH, "utf8");
    const parsed = JSON.parse(raw) as CardStore;
    if (Array.isArray(parsed.cards)) return parsed;
  } catch {
    /* empty */
  }
  return { cards: [] };
}

async function writeStore(store: CardStore) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CARDS_PATH, JSON.stringify(store, null, 2), "utf8");
}

const TOPIC_LABELS: Record<FlowchartId, string> = {
  overview: "Systems overview",
  career: "Career & background",
  delivery: "Implementation delivery",
  integration: "Enterprise integrations",
  projects: "Personal projects",
  ai: "AI in delivery",
  skills: "Skills & stack",
  hiring: "Hiring & fit",
  incident: "Production incidents",
};

const TOPIC_TAGS: Record<string, string[]> = {
  "Voice AI & ROI": ["voice", "roi", "voice agent", "relive"],
  "Enterprise rollout": ["rollout", "thailand", "coca", "enterprise", "workflow"],
  "Enterprise messaging": ["kafka", "messaging", "event"],
  "Infrastructure & ops": ["kubernetes", "k8s", "infrastructure", "ops"],
  "How I answer": ["systems", "consultant", "founder", "engineer"],
  "PIKU & AI memory": ["piku", "memory", "ai", "context"],
};

function inferTopic(userText: string, flowchart?: FlowchartId): string {
  if (flowchart && TOPIC_LABELS[flowchart]) return TOPIC_LABELS[flowchart];
  const t = userText.toLowerCase();
  if (/\bvoice|roi\b/.test(t)) return "Voice AI & ROI";
  if (/\bkafka|event|messaging\b/.test(t)) return "Enterprise messaging";
  if (/\bkubernetes|k8s\b/.test(t)) return "Infrastructure & ops";
  if (/\bpiku\b/.test(t)) return "PIKU & AI memory";
  if (/\bhire|role|job|fit\b/.test(t)) return "Hiring & fit";
  if (/\bintegrat|erp|dms|api\b/.test(t)) return "Enterprise integrations";
  if (/\brelive|mandibhai|project\b/.test(t)) return "Personal projects";
  return "General systems";
}

function cardTags(card: OrbMemoryCard): string[] {
  if (card.tags?.length) return card.tags;
  return TOPIC_TAGS[card.topic] ?? [];
}

function isUsableCard(card: OrbMemoryCard): boolean {
  if (LEAK_RE.test(card.responseThatWorked)) return false;
  if (LEAK_RE.test(card.observation ?? "")) return false;
  return true;
}

function scoreCard(card: OrbMemoryCard, query: string): number {
  if (!isUsableCard(card)) return -1;
  const t = query.toLowerCase();
  let score = card.source === "seed" ? 1 : 0;
  if (card.topic.toLowerCase().split(/\W+/).some((w) => w.length > 3 && t.includes(w))) score += 3;
  for (const tag of cardTags(card)) {
    if (t.includes(tag)) score += 5;
  }
  if (card.userQuestion && t.split(/\W+/).some((w) => w.length > 4 && card.userQuestion!.toLowerCase().includes(w))) {
    score += 2;
  }
  const blob = `${card.topic} ${card.observation ?? ""} ${card.responseThatWorked}`.toLowerCase();
  for (const word of t.match(/[a-z]{4,}/g) ?? []) {
    if (blob.includes(word)) score += 1;
  }
  return score;
}

/** Retrieve top relevant cards only — never inject the full library. */
export async function retrieveMemoryCards(userText: string, limit = 3): Promise<OrbMemoryCard[]> {
  const { cards } = await readStore();
  return cards
    .map((c) => ({ c, score: scoreCard(c, userText) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.c.ts - a.c.ts)
    .slice(0, limit)
    .map((x) => x.c);
}

export function formatMemoryCardsForPrompt(cards: OrbMemoryCard[]): string {
  if (cards.length === 0) return "";
  return cards
    .map((c) => {
      const lines = [
        `[${c.topic}]`,
        c.observation,
        c.responseThatWorked,
        c.usefulAnalogy ? `Analogy: ${c.usefulAnalogy}` : null,
      ]
        .filter(Boolean)
        .join(" ");
      return lines;
    })
    .join("\n");
}

export async function listMemoryCards(): Promise<OrbMemoryCard[]> {
  const { cards } = await readStore();
  return cards.sort((a, b) => b.ts - a.ts);
}

export async function deleteMemoryCard(id: string): Promise<boolean> {
  const store = await readStore();
  const next = store.cards.filter((c) => c.id !== id);
  if (next.length === store.cards.length) return false;
  await writeStore({ cards: next });
  return true;
}

export async function maybeAppendMemoryCard(opts: {
  userText: string;
  assistantText: string;
  flowchart?: FlowchartId;
}) {
  const { userText, assistantText, flowchart } = opts;
  if (userText.length < 35 || assistantText.length < 80) return;
  if (GREETING_RE.test(userText.trim())) return;
  if (LEAK_RE.test(assistantText)) return;

  const store = await readStore();
  const duplicate = store.cards.some(
    (c) => c.source === "auto" && c.userQuestion?.toLowerCase() === userText.toLowerCase().slice(0, 120),
  );
  if (duplicate) return;

  const topic = inferTopic(userText, flowchart);
  const card: OrbMemoryCard = {
    id: randomUUID(),
    ts: Date.now(),
    topic,
    tags: TOPIC_TAGS[topic],
    observation: `Topic surfaced in a visitor conversation (${topic}).`,
    responseThatWorked: assistantText.slice(0, 380) + (assistantText.length > 380 ? "…" : ""),
    userQuestion: undefined,
    source: "auto",
  };

  const auto = store.cards.filter((c) => c.source === "auto");
  const seeds = store.cards.filter((c) => c.source === "seed");
  const trimmedAuto = [card, ...auto].slice(0, 25);
  await writeStore({ cards: [...seeds, ...trimmedAuto] });
}
