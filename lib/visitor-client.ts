const VISITOR_KEY = "atlas-visitor-id";
const SESSION_KEY = "atlas-orb-session";

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getOrbSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackPageview() {
  const visitorId = getVisitorId();
  if (!visitorId) return;
  fetch("/api/analytics/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      path: window.location.pathname,
      referrer: document.referrer || "",
    }),
  }).catch(() => {});
}

export function trackOrbOpen() {
  const visitorId = getVisitorId();
  const sessionId = getOrbSessionId();
  if (!visitorId || !sessionId) return;
  fetch("/api/analytics/orb-open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, sessionId }),
  }).catch(() => {});
}
