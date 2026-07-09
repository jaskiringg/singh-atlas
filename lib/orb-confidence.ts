import type { OrbConfidence, OrbLens, OrbMeta } from "@/lib/orb-response";
import type { OrbMode } from "@/lib/orb-modes";

const HIGH_RE =
  /\b(kafka|event.?driven|salescode|coca.?cola|coke|thailand|rollout|erp|dms|integration|sql|api gateway|relive|lasik|voice ai|voice agent|mandibhai|uat|go.?live|production incident|root cause)\b/i;

const MEDIUM_RE =
  /\b(microservices|monolith|kubernetes|k8s|rag|llm|agent|crm|workflow|consulting|implementation|enterprise)\b/i;

const LOW_RE = /\b(blockchain|web3|rust|golang|mobile native|game dev|quantum|embedded)\b/i;

export function inferConfidence(userText: string): OrbConfidence {
  const t = userText.toLowerCase();
  if (LOW_RE.test(t) && !HIGH_RE.test(t) && !MEDIUM_RE.test(t)) return "low";
  if (HIGH_RE.test(t)) return "high";
  if (MEDIUM_RE.test(t)) return "medium";
  return "medium";
}

export function inferLenses(mode: OrbMode, userText: string): OrbLens[] {
  const lenses = new Set<OrbLens>();
  const t = userText.toLowerCase();

  if (mode === "recruiter" || mode === "career" || /\b(hire|team|delivery|ops)\b/.test(t)) {
    lenses.add("consultant");
  }
  if (mode === "founder" || /\b(piku|product|startup|moat|adoption)\b/.test(t)) {
    lenses.add("founder");
  }
  if (mode === "technical" || mode === "architecture" || /\b(architect|kafka|api|sql|code|debug)\b/.test(t)) {
    lenses.add("engineer");
  }

  if (lenses.size === 0) {
    lenses.add("engineer");
    lenses.add("consultant");
  }
  return [...lenses].slice(0, 3);
}

export function buildOrbMeta(userText: string, mode: OrbMode): OrbMeta {
  return {
    lenses: inferLenses(mode, userText),
    confidence: inferConfidence(userText),
  };
}

export function confidenceHint(confidence: OrbConfidence): string {
  switch (confidence) {
    case "high":
      return "I've built or operated this in production — state that briefly if relevant.";
    case "medium":
      return "Adjacent experience — be clear you haven't owned every edge case.";
    case "low":
      return 'Say: "I haven\'t worked with that directly, but here\'s how I\'d approach it."';
    default:
      return "";
  }
}
