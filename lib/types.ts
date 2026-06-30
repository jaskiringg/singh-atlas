export interface RepoEvidence {
  slug: string;
  name: string;
  visibility: "public" | "private";
  role: string;
  signal: string;
  stack: string[];
  atlasApp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  category: "operate" | "architect" | "build" | "enterprise" | "ai";
}

export interface TimelineEntry {
  period: string;
  title: string;
  repos: string[];
  insight: string;
}

export interface AtlasEvidence {
  repos: RepoEvidence[];
  patterns: Pattern[];
  timeline: TimelineEntry[];
  operateVerbs: string[];
  proofPoints: { label: string; detail: string }[];
  identity: { name: string; tagline: string; thesis: string };
}
