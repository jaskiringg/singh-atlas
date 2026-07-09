import { readFile } from "fs/promises";
import path from "path";
import type { OrbMode } from "@/lib/orb-modes";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const KNOWLEDGE_PATH = path.join(DATA_DIR, "orb-knowledge.md");

const PLACEHOLDER_RE = /^<!--[\s\S]*?-->\s*/m;

/** Which knowledge sections to load per mode (keeps prompt small). */
const MODE_SECTIONS: Record<OrbMode, string[]> = {
  greeting: ["Who I am", "Voice & phrases"],
  opinion: ["Experience", "Priorities", "Voice & phrases", "Engineering opinions"],
  technical: ["Experience", "How I think", "Skills", "Engineering opinions"],
  career: ["Who I am", "Projects", "Employment history", "What I'm looking for"],
  recruiter: ["Who I am", "Employment history", "What I'm looking for", "Ownership"],
  founder: ["PIKU", "Product mindset", "What excites me", "Long-term vision"],
  architecture: ["Experience", "Priorities", "How I think", "Engineering opinions", "Decision making"],
  brainstorm: ["Experience", "Conversation gravity", "Mental models", "What excites me"],
};

const TOPIC_SECTIONS: [RegExp, string[]][] = [
  [/\b(kafka|event|messaging)\b/i, ["Experience", "Engineering opinions"]],
  [/\b(kubernetes|k8s|microservice)\b/i, ["Engineering opinions", "Things I avoid"]],
  [/\b(voice|roi|relive|lasik)\b/i, ["Experience", "Projects"]],
  [/\b(piku|memory|rag|agent)\b/i, ["PIKU", "Product mindset"]],
  [/\b(thailand|coca|rollout|salescode)\b/i, ["Experience", "Employment history", "Stories"]],
  [/\b(incident|production|outage)\b/i, ["Experience", "How I think"]],
  [/\b(integrat|erp|dms|api)\b/i, ["Employment history", "Engineering opinions"]],
];

function parseSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = markdown.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const title = nl === -1 ? part.trim() : part.slice(0, nl).trim();
    const body = nl === -1 ? "" : part.slice(nl + 1).trim();
    if (title && body) sections.set(title, body);
  }
  return sections;
}

function sectionScore(title: string, userText: string): number {
  const t = userText.toLowerCase();
  const words = title.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  let score = 0;
  for (const w of words) {
    if (t.includes(w)) score += 2;
  }
  return score;
}

export async function sliceKnowledge(userText: string, mode: OrbMode, maxChars = 1800): Promise<string> {
  let raw: string;
  try {
    raw = await readFile(KNOWLEDGE_PATH, "utf8");
    raw = raw.replace(PLACEHOLDER_RE, "").trim();
  } catch {
    return "";
  }

  const sections = parseSections(raw);

  const wantedNames = new Set<string>(MODE_SECTIONS[mode] ?? MODE_SECTIONS.opinion);
  for (const [re, names] of TOPIC_SECTIONS) {
    if (re.test(userText)) names.forEach((n) => wantedNames.add(n));
  }

  const wanted = (title: string) => [...wantedNames].some((w) => title.toLowerCase().startsWith(w.toLowerCase()));

  const ranked = [...sections.entries()]
    .map(([title, body]) => ({
      title,
      body,
      score: sectionScore(title, userText) + (wanted(title) ? 5 : 0),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const chunks: string[] = [];
  let len = 0;
  for (const { title, body } of ranked) {
    const chunk = `### ${title}\n${body}`;
    if (len + chunk.length > maxChars) break;
    chunks.push(chunk);
    len += chunk.length;
  }

  if (chunks.length === 0) {
    for (const [title, body] of sections) {
      if (!wanted(title)) continue;
      const chunk = `### ${title}\n${body}`;
      if (len + chunk.length > maxChars) break;
      chunks.push(chunk);
      len += chunk.length;
    }
  }

  return chunks.join("\n\n");
}
