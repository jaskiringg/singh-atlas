export interface Repo {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  pushedAt: string;
  isPrivate: boolean;
  url: string;
}

export interface Pattern {
  signal: string;
  evidence: string;
  repos: string[];
}

export interface EvidenceManifest {
  repos: Repo[];
  patterns: Pattern[];
  generatedAt: string;
}
