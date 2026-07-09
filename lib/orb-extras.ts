export const RESUME_PDF_URL = "/resume/jaskirat-singh-resume.pdf";
export const RESUME_PDF_NAME = "Jaskirat-Singh-Resume.pdf";

export type FlowchartId =
  | "overview"
  | "career"
  | "delivery"
  | "integration"
  | "projects"
  | "ai"
  | "skills"
  | "hiring"
  | "incident";

export type OrbExtras = {
  showResume?: boolean;
  flowchart?: FlowchartId;
  suggestBooking?: boolean;
};

/** Attach a relevant flowchart only for meaningful questions. */
export function detectOrbExtras(userText: string): OrbExtras {
  const t = userText.toLowerCase();
  const extras: OrbExtras = {};

  // Avoid diagrams for tiny greetings/thanks. Let the conversation feel natural.
  if (/^\s*(hi|hello|hey|sup|yo|thanks|thank you|thx|ok|okay)\b/.test(t)) {
    return extras;
  }

  if (
    /\b(resume|cv|curriculum|career|experience|work history|background|what do you do|what you do|your role|your job|tell me about yourself|who are you|qualifications|your story|journey|timeline|how did you get)\b/.test(
      t,
    )
  ) {
    extras.showResume = true;
    extras.flowchart = "career";
    return extras;
  }

  if (/\b(integration|architecture|erp|dms|kafka|delta sync|how systems connect|api gateway|master data)\b/.test(t)) {
    extras.flowchart = "integration";
    return extras;
  }

  if (/\b(incident|production|broke|root cause|debug|outage|kafka lag|sql mismatch|fix)\b/.test(t)) {
    extras.flowchart = "incident";
    return extras;
  }

  if (/\b(piku|relive|mandibhai|project|built|building|personal|side project|github|repo)\b/.test(t)) {
    extras.flowchart = "projects";
    return extras;
  }

  if (/\b(ai|llm|rag|agent|prompt|voice ai|copilot|artificial intelligence)\b/.test(t)) {
    extras.flowchart = "ai";
    return extras;
  }

  if (/\b(skill|stack|tech|python|sql|tools|expertise|what can you)\b/.test(t)) {
    extras.flowchart = "skills";
    return extras;
  }

  if (/\b(hire|hiring|fit|role|job|recruiter|interview|available|looking for|forward deployed|solutions engineer|consultant)\b/.test(t)) {
    extras.showResume = true;
    extras.flowchart = "hiring";
    return extras;
  }

  if (/\b(how do you work|your approach|delivery|implementation|lifecycle|go-live|uat|workshop|onboarding)\b/.test(t)) {
    extras.flowchart = "delivery";
    return extras;
  }

  if (/\b(book|connect|call|meet|schedule|chat live|talk to you|reach you|get in touch|contact you)\b/.test(t)) {
    extras.suggestBooking = true;
    return extras;
  }

  // Otherwise, no flowchart. (But the orb still answers normally.)
  return extras;
}
