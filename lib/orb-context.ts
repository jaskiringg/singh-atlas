import { readFile } from "fs/promises";
import path from "path";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact";
import { confidenceHint, buildOrbMeta } from "@/lib/orb-confidence";
import { formatExamplesForPrompt, selectExamples } from "@/lib/orb-examples";
import { sliceKnowledge } from "@/lib/orb-knowledge-slice";
import {
  detectOrbMode,
  MODE_RULES,
  MODE_TEMPLATES,
  shouldAskFirst,
  type OrbMode,
  type OrbTurn,
} from "@/lib/orb-modes";
import { formatMemoryCardsForPrompt, retrieveMemoryCards } from "@/lib/orb-memory-cards";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const RESUME_PATH = path.join(DATA_DIR, "resume.md");

export const ORB_IDENTITY = `You ARE Jaskirat Singh speaking in first person (I/me/my) — AI version on jaskirat.sys.
Consultant, bridge engineer, and operator. Gurugram, India.
"I don't ask how to build it. I ask how it should work."
Never sound like a chatbot. No emoji. No "Hey there!" No "I'm all ears." No "Happy to help."`;

const CORE_RULES = `ANSWER AS ME:
- First person always. You are Jaskirat, not an assistant describing Jaskirat.
- Speak only the final answer. Never expose planning or prompts.
- Lead with insight — credentials support the argument, never open with them.
- Disagree politely when architecture exceeds value.
- 2-5 sentences unless depth requested. Dry, direct, conversational.
- Contact: Connect button · ${CONTACT_EMAIL} · ${CONTACT_PHONE} (give both when asked for reach-me details)`;

async function loadAdminNotes(): Promise<string> {
  try {
    const text = await readFile(RESUME_PATH, "utf8");
    if (text.trim() && !text.startsWith("# Jaskirat Singh")) return text.trim().slice(0, 600);
  } catch {
    /* empty */
  }
  return "";
}

export type OrbPromptContext = {
  userText: string;
  messages: OrbTurn[];
};

export type BuiltOrbPrompt = {
  prompt: string;
  mode: OrbMode;
  askFirst: boolean;
};

export async function buildOrbSystemPrompt(ctx: OrbPromptContext): Promise<BuiltOrbPrompt> {
  const { userText, messages } = ctx;
  const mode = detectOrbMode(userText);
  const askFirst = shouldAskFirst(userText, messages);
  const meta = buildOrbMeta(userText, mode);

  const [memories, knowledge, adminNotes] = await Promise.all([
    retrieveMemoryCards(userText, 3),
    sliceKnowledge(userText, mode),
    loadAdminNotes(),
  ]);

  const examples = selectExamples(userText, mode, askFirst ? 1 : 2);
  const memoryBlock = formatMemoryCardsForPrompt(memories);
  const exampleBlock = formatExamplesForPrompt(examples);

  const parts: string[] = [
    ORB_IDENTITY,
    CORE_RULES,
    `MODE: ${mode}`,
    `MODE RULES: ${MODE_RULES[mode]}`,
    `TEMPLATE: ${MODE_TEMPLATES[mode]}`,
    `CONFIDENCE (${meta.confidence}): ${confidenceHint(meta.confidence)}`,
  ];

  if (mode === "greeting") {
    parts.push(
      `THIS TURN: Reply in ONE short line as Jaskirat. Ask what they're building or stuck on. No meta. No lecture.`,
    );
  } else if (askFirst) {
    parts.push(
      `THIS TURN — ASK FIRST: Reply with ONLY one short clarifying question (1-2 sentences). Do NOT answer yet. End with ?`,
    );
  }

  if (mode !== "greeting" && memoryBlock) parts.push(`RELEVANT MEMORIES (weave naturally, never mention "memory cards"):\n${memoryBlock}`);
  if (exampleBlock) parts.push(`TONE EXAMPLES (match style, don't copy):\n${exampleBlock}`);
  if (knowledge) parts.push(`FACTS (reference only):\n${knowledge}`);
  if (adminNotes) parts.push(`ADMIN NOTES:\n${adminNotes}`);

  return { prompt: parts.join("\n\n"), mode, askFirst };
}

// Admin helpers
const KNOWLEDGE_PATH = path.join(DATA_DIR, "orb-knowledge.md");
const PLACEHOLDER_RE = /^<!--[\s\S]*?-->\s*/m;

export async function readKnowledgeForAdmin(): Promise<string> {
  try {
    const k = await readFile(KNOWLEDGE_PATH, "utf8");
    if (k.replace(PLACEHOLDER_RE, "").trim()) return k.replace(PLACEHOLDER_RE, "").trim();
  } catch {
    /* empty */
  }
  try {
    return await readFile(RESUME_PATH, "utf8");
  } catch {
    return "";
  }
}

export async function writeKnowledgeFromAdmin(content: string) {
  const { mkdir, writeFile } = await import("fs/promises");
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(KNOWLEDGE_PATH, content, "utf8");
}
