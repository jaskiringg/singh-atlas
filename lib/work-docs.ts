import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type WorkMeta = {
  title: string;
  slug: string;
  kicker: string;
  github: string | null;
  live: string | null;
  download: string;
};

export type WorkDoc = {
  meta: WorkMeta;
  html: string;
  markdown: string;
};

const WORK_DIR = path.join(process.cwd(), "content", "work");

const SLUGS = ["piku", "relivecure", "mandibhai", "salescode", "voice-agent"] as const;
export type WorkSlug = (typeof SLUGS)[number];

export function listWorkSlugs(): WorkSlug[] {
  return [...SLUGS];
}

export function getWorkDoc(slug: string): WorkDoc | null {
  const file = path.join(WORK_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const meta: WorkMeta = {
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    kicker: String(data.kicker ?? ""),
    github: data.github ? String(data.github) : null,
    live: data.live ? String(data.live) : null,
    download: String(data.download ?? `/docs/${slug}.md`),
  };
  const html = marked.parse(content, { async: false }) as string;
  return { meta, html, markdown: content };
}

export const WORK_INDEX: {
  slug: WorkSlug;
  title: string;
  blurb: string;
}[] = [
  { slug: "piku", title: "PIKU", blurb: "Local-first AI workspace — world model, memory, agents." },
  { slug: "relivecure", title: "ReliveCure", blurb: "Clinic ops — WhatsApp, CRM, Agent Console, voice app layer." },
  { slug: "mandibhai", title: "MandiBhai", blurb: "B2B ordering — inventory, pricing, admin SKU ops." },
  { slug: "salescode", title: "Salescode", blurb: "Enterprise implementation lifecycle — discovery → hypercare." },
  { slug: "voice-agent", title: "Voice agent", blurb: "Infra vs application layer when deploying enterprise voice AI." },
];
