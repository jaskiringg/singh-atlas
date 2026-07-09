import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const ANALYTICS_PATH = path.join(DATA_DIR, "analytics.json");
const RESUME_PATH = path.join(DATA_DIR, "resume.md");

export type PageviewEvent = {
  type: "pageview";
  id: string;
  ts: number;
  path: string;
  referrer: string;
  visitorId: string;
};

export type OrbMessageEvent = {
  type: "orb_message";
  id: string;
  ts: number;
  sessionId: string;
  visitorId: string;
  role: "user" | "assistant";
  text: string;
};

export type OrbOpenEvent = {
  type: "orb_open";
  id: string;
  ts: number;
  sessionId: string;
  visitorId: string;
};

export type ContactRequestEvent = {
  type: "contact_request";
  id: string;
  ts: number;
  sessionId: string;
  visitorId: string;
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
};

export type AnalyticsEvent = PageviewEvent | OrbMessageEvent | OrbOpenEvent | ContactRequestEvent;

type AnalyticsStore = {
  events: AnalyticsEvent[];
};

const pendingQueue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let writeInProgress: Promise<void> | null = null;

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readStore(): Promise<AnalyticsStore> {
  await ensureDataDir();
  try {
    const raw = await readFile(ANALYTICS_PATH, "utf8");
    const parsed = JSON.parse(raw) as AnalyticsStore;
    return { events: Array.isArray(parsed.events) ? parsed.events : [] };
  } catch {
    return { events: [] };
  }
}

async function writeStore(store: AnalyticsStore) {
  await ensureDataDir();
  await writeFile(ANALYTICS_PATH, JSON.stringify(store), "utf8");
}

async function flushPending() {
  if (!pendingQueue.length) return;

  const batch = pendingQueue.splice(0, pendingQueue.length);
  try {
    const store = await readStore();
    store.events.push(...batch);
    if (store.events.length > 5000) {
      store.events = store.events.slice(-5000);
    }
    await writeStore(store);
  } catch (e) {
    console.error("Analytics flush failed:", e);
    pendingQueue.unshift(...batch);
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    writeInProgress = flushPending().finally(() => {
      writeInProgress = null;
    });
  }, 5000);
}

export async function appendEvent(
  event:
    | Omit<PageviewEvent, "id" | "ts">
    | Omit<OrbMessageEvent, "id" | "ts">
    | Omit<OrbOpenEvent, "id" | "ts">
    | Omit<ContactRequestEvent, "id" | "ts">,
) {
  const full: AnalyticsEvent = {
    ...event,
    id: randomUUID(),
    ts: "ts" in event && typeof event.ts === "number" ? event.ts : Date.now(),
  } as AnalyticsEvent;

  pendingQueue.push(full);

  if (pendingQueue.length >= 20) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    writeInProgress = flushPending().finally(() => {
      writeInProgress = null;
    });
  } else {
    scheduleFlush();
  }

  return full;
}

export async function flushAnalytics() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (writeInProgress) {
    await writeInProgress;
  }
  if (pendingQueue.length) {
    await flushPending();
  }
}

export type OrbSession = {
  sessionId: string;
  visitorId: string;
  startedAt: number;
  lastAt: number;
  messages: { role: "user" | "assistant"; text: string; ts: number }[];
};

export type ContactRequest = {
  id: string;
  ts: number;
  sessionId: string;
  visitorId: string;
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
};

export type AnalyticsSummary = {
  pageviews: { total: number; today: number; week: number };
  orbOpens: { total: number; today: number; week: number };
  orbMessages: { total: number; user: number; assistant: number };
  contactRequests: { total: number; today: number; week: number };
  sessions: OrbSession[];
  recentPageviews: PageviewEvent[];
  contactRequestsList: ContactRequest[];
};

function isToday(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(ts: number) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return ts >= weekAgo;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const store = await readStore();
  const events = store.events;

  const pageviews = events.filter((e): e is PageviewEvent => e.type === "pageview");
  const orbOpens = events.filter((e): e is OrbOpenEvent => e.type === "orb_open");
  const orbMessages = events.filter((e): e is OrbMessageEvent => e.type === "orb_message");
  const contactRequests = events.filter((e): e is ContactRequestEvent => e.type === "contact_request");

  const sessionMap = new Map<string, OrbSession>();
  for (const e of events) {
    if (e.type === "orb_open") {
      if (!sessionMap.has(e.sessionId)) {
        sessionMap.set(e.sessionId, {
          sessionId: e.sessionId,
          visitorId: e.visitorId,
          startedAt: e.ts,
          lastAt: e.ts,
          messages: [],
        });
      }
    }
    if (e.type === "orb_message") {
      let s = sessionMap.get(e.sessionId);
      if (!s) {
        s = {
          sessionId: e.sessionId,
          visitorId: e.visitorId,
          startedAt: e.ts,
          lastAt: e.ts,
          messages: [],
        };
        sessionMap.set(e.sessionId, s);
      }
      s.messages.push({ role: e.role, text: e.text, ts: e.ts });
      s.lastAt = Math.max(s.lastAt, e.ts);
    }
  }

  const sessions = [...sessionMap.values()].sort((a, b) => b.lastAt - a.lastAt);

  return {
    pageviews: {
      total: pageviews.length,
      today: pageviews.filter((e) => isToday(e.ts)).length,
      week: pageviews.filter((e) => isThisWeek(e.ts)).length,
    },
    orbOpens: {
      total: orbOpens.length,
      today: orbOpens.filter((e) => isToday(e.ts)).length,
      week: orbOpens.filter((e) => isThisWeek(e.ts)).length,
    },
    orbMessages: {
      total: orbMessages.length,
      user: orbMessages.filter((e) => e.role === "user").length,
      assistant: orbMessages.filter((e) => e.role === "assistant").length,
    },
    contactRequests: {
      total: contactRequests.length,
      today: contactRequests.filter((e) => isToday(e.ts)).length,
      week: contactRequests.filter((e) => isThisWeek(e.ts)).length,
    },
    sessions,
    recentPageviews: pageviews.slice(-20).reverse(),
    contactRequestsList: contactRequests
      .map((e) => ({
        id: e.id,
        ts: e.ts,
        sessionId: e.sessionId,
        visitorId: e.visitorId,
        name: e.name,
        email: e.email,
        phone: e.phone,
        note: e.note,
      }))
      .sort((a, b) => b.ts - a.ts),
  };
}

export async function readResumeFile(): Promise<string> {
  await ensureDataDir();
  try {
    return await readFile(RESUME_PATH, "utf8");
  } catch {
    const placeholder = `<!-- Paste your resume below. This text is fed to the orb as extra context. -->

`;
    await writeFile(RESUME_PATH, placeholder, "utf8");
    return placeholder;
  }
}

export async function writeResumeFile(content: string) {
  await ensureDataDir();
  await writeFile(RESUME_PATH, content, "utf8");
}
