import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

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

const SLUGS = ["salescode", "relivecure", "piku", "mandibhai"] as const;
export type WorkSlug = (typeof SLUGS)[number];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const marked = new Marked();
marked.use({
  renderer: {
    code({ text, lang }) {
      const language = (lang ?? "").trim();
      if (language === "mermaid") {
        return `<pre class="mermaid">${escapeHtml(text)}</pre>\n`;
      }
      const cls = language ? ` class="language-${escapeHtml(language)}"` : "";
      return `<pre><code${cls}>${escapeHtml(text)}</code></pre>\n`;
    },
  },
});

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
  lane: "build" | "operate" | "consult" | "essay";
  github?: string | null;
}[] = [
  { slug: "salescode", title: "Salescode AI × Coca-Cola", blurb: "Flagship. Enterprise implementations + SCAI application layer.", lane: "consult", github: null },
  { slug: "relivecure", title: "ReliveCure", blurb: "Call intelligence · transferred.", lane: "operate", github: "https://github.com/jaskiringg/relive-cure" },
  { slug: "piku", title: "Eko / PIKU", blurb: "In progress. Local-first AI workspace — designed, not shipped.", lane: "build", github: "https://github.com/jaskiringg/piku" },
  { slug: "mandibhai", title: "Mandi Bhai", blurb: "Early marketplace. Transferred to their team.", lane: "build", github: "https://github.com/jaskiringg/mandibhai" },
];
