/** What the public orb may discuss vs what requires a direct conversation. */

export const ORB_PRIVACY_RULES = `PUBLIC BOUNDARIES (non-negotiable):
- You know my professional story — approach, projects, public career facts, how I think about systems.
- NEVER state or estimate: my rates, fees, salary, CTC, compensation, contract values, client deal sizes, personal revenue, profit, or "how much I charge."
- NEVER share: home address, family/relationship details, government IDs, passwords, admin access, patient/customer names or records, or other visitors' messages.
- If asked for private commercial or personal details: decline in one calm sentence and point to email/Connect for a real conversation. Do not guess numbers.
- ROI and architecture opinions are fine at a framework level — not my private financials or a client's confidential terms.`;

export function isPrivateInfoRequest(text: string): boolean {
  const t = text.toLowerCase();

  if (
    /\b(how much|what).{0,40}\b(charge|charging|fee|fees|rate|rates|cost|pay you|your price|price your)\b/.test(t)
  ) {
    return true;
  }
  if (/\b(hourly|daily|day rate|consulting rate|consulting fee|project fee|your fee)\b/.test(t)) {
    return true;
  }
  if (/\b(salary|ctc|compensation|package|pay package|how much (do you|you) (make|earn)|your income|take home)\b/.test(t)) {
    return true;
  }
  if (/\b(contract value|deal size|invoice amount|what (did|do) you bill|billing rate)\b/.test(t) && /\b(you|your|jaskirat)\b/.test(t)) {
    return true;
  }
  if (/\b(your|personal).{0,30}\b(revenue|profit|margin|earnings|net worth|bank)\b/.test(t)) {
    return true;
  }
  if (/\b(home address|where do you live|your address|family|wife|husband|girlfriend|boyfriend)\b/.test(t)) {
    return true;
  }
  if (/\b(patient name|customer name|lead list|phone numbers|whatsapp (logs|messages))\b/.test(t)) {
    return true;
  }
  if (/\b(admin password|api key|secret|env var|\.env)\b/.test(t)) {
    return true;
  }

  return false;
}

export function privateInfoReplyAsMe(): string {
  return "I don't put rates, salary, or contract numbers on the public site — that's for a direct conversation once there's real scope. Email or Connect works; happy to talk fit and approach here.";
}

const PRIVATE_OUTPUT_LINE_RE =
  /\b(i charge|my rate|my fee|i typically charge|hourly rate|per hour|per day|my salary|i earn|ctc is|compensation is|₹\s*[\d,]+|\$\s*[\d,]+(?:\s*\/?\s*(?:hr|hour|day))?)\b/i;

/** Strip lines that look like disclosed private commercial details. */
export function redactPrivateDisclosures(text: string): string {
  const paragraphs = text.split(/\n{2,}/);
  const kept = paragraphs.filter((p) => !PRIVATE_OUTPUT_LINE_RE.test(p));
  if (kept.length === 0) return privateInfoReplyAsMe();
  const out = kept.join("\n\n").trim();
  if (PRIVATE_OUTPUT_LINE_RE.test(out)) return privateInfoReplyAsMe();
  return out;
}
