import type { AtlasEvidence, Pattern } from "./types";
import evidence from "@/content/evidence/atlas.json";

export function getEvidence(): AtlasEvidence {
  return evidence as AtlasEvidence;
}

export function getRepo(slug: string) {
  return getEvidence().repos.find((r) => r.slug === slug);
}

export function getPatternsByCategory(category: Pattern["category"]) {
  return getEvidence().patterns.filter((p) => p.category === category);
}

export function getPatternsForRepo(slug: string) {
  return getEvidence().patterns.filter((p) => p.evidence.includes(slug));
}
