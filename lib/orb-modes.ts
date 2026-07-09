export type OrbMode =
  | "greeting"
  | "opinion"
  | "technical"
  | "career"
  | "recruiter"
  | "founder"
  | "architecture"
  | "brainstorm";

export type OrbTurn = { role: "user" | "assistant"; text: string };

const GREETING_ONLY_RE = /^\s*(hi|hello|hey|sup|yo|good (morning|afternoon|evening))\b[!.?,]*\s*$/i;
const GREETING_START_RE = /^\s*(hi|hello|hey|sup|yo|good (morning|afternoon|evening))\b/i;

export function isSimpleGreeting(text: string): boolean {
  const t = text.trim();
  if (GREETING_ONLY_RE.test(t)) return true;
  return /^\s*(hi|hello|hey)\b/i.test(t) && t.length < 35 && t.split(/\s+/).length <= 5;
}

const BROAD_OPINION_RE =
  /\b(what do you think|roi|worth it|good idea|should we|would you recommend|your opinion|how would you approach|pros and cons)\b/i;

const CONTEXT_SIGNAL_RE =
  /\b(internal|customer.?facing|sales|support|healthcare|saas|b2b|b2c|outbound|inbound|clinic|enterprise|startup|team of \d|three dev|small team)\b/i;

const CLARIFY_QUESTION_RE = /\?\s*$/;

export function detectOrbMode(userText: string): OrbMode {
  const t = userText.toLowerCase();
  if (GREETING_START_RE.test(t) && t.length < 40) return "greeting";
  if (/\b(hire|hiring|recruiter|interview|role fit|available for|looking for a)\b/.test(t)) return "recruiter";
  if (/\b(piku|moat|startup|founder|product vision|distribution|go.?to.?market)\b/.test(t)) return "founder";
  if (/\b(about yourself|who are you|your background|your story|tell me about you|career path)\b/.test(t)) return "career";
  if (/\b(architecture review|system design|design this|how would you architect|review my)\b/.test(t)) return "architecture";
  if (/\b(should we use|kubernetes|k8s|kafka|microservices|monolith|event.?driven)\b/.test(t)) return "architecture";
  if (BROAD_OPINION_RE.test(t)) return "opinion";
  if (/\b(how does|how do i|explain|implement|debug|write|configure|setup)\b/.test(t)) return "technical";
  if (/\b(ideas|brainstorm|what if|explore|possibilities)\b/.test(t)) return "brainstorm";
  if (/\b(architecture|integrat|workflow|rollout|incident|production)\b/.test(t)) return "architecture";
  return "opinion";
}

/** True when the assistant already asked a clarifying question and the user is replying. */
export function isFollowUpToClarification(messages: OrbTurn[]): boolean {
  if (messages.length < 2) return false;
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return false;
  const t = lastAssistant.text.trim();
  return CLARIFY_QUESTION_RE.test(t) && t.length < 220 && !/\n\n/.test(t);
}

/** Broad questions get ONE clarifying question first — unless user already gave context or is following up. */
export function shouldAskFirst(userText: string, messages: OrbTurn[]): boolean {
  if (isFollowUpToClarification(messages)) return false;
  if (CONTEXT_SIGNAL_RE.test(userText)) return false;
  const mode = detectOrbMode(userText);
  if (mode === "greeting" || mode === "career" || mode === "recruiter") return false;
  if (BROAD_OPINION_RE.test(userText)) return true;
  if (mode === "architecture" && /\b(should we|kubernetes|k8s|kafka|microservices)\b/i.test(userText)) return true;
  if (/\b(voice agent|voice ai|roi)\b/i.test(userText) && !CONTEXT_SIGNAL_RE.test(userText)) return true;
  return false;
}

export const MODE_TEMPLATES: Record<OrbMode, string> = {
  greeting:
    'One short line. First person. Example: "Hey. What are you building — or where are you stuck?" No emoji. No "I\'m all ears." No "Hey there!"',
  opinion:
    "Structure: Clarifying question (if needed) → Core insight → Brief experience → Tradeoff → Optional follow-up. Lead with insight, not credentials.",
  technical:
    "Structure: Direct answer → Why it works → Pitfall → When I'd do differently. State confidence.",
  career:
    "Structure: 2-sentence summary → 2-3 proof points → What I'm looking for. No résumé dump.",
  recruiter:
    "Structure: Summary → Evidence of ownership → Business impact → Invite to connect.",
  founder:
    "Structure: Product insight → Distribution/adoption angle → What I'd validate next.",
  architecture:
    "Structure: Restate understanding → Business problem → Architecture options → Tradeoffs → Recommendation. Challenge weak premises.",
  brainstorm:
    "Structure: Reframe the problem → 2-3 directions → What I'd prototype first.",
};

export const MODE_RULES: Record<OrbMode, string> = {
  greeting:
    "ANSWER AS ME. You ARE Jaskirat (AI version). One sentence + one question. Direct, not bubbly. Never assistant-speak.",
  opinion: "Ask ONE clarifying question if context is missing. Challenge compound questions (e.g. ROI for whom?).",
  technical: "Be precise. Mention what breaks in production.",
  career: "Bridge engineer + consultant + founder. Whole-system thinker.",
  recruiter: "Impact and ownership over buzzwords.",
  founder: "Moats, adoption, workflow — not feature lists.",
  architecture: "Business before technology. Disagree politely when complexity exceeds value.",
  brainstorm: "Zoom out to systems. Everything is a system.",
};
