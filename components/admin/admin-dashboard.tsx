"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsSummary } from "@/lib/analytics-store";
import type { OrbMemoryCard } from "@/lib/orb-memory-cards";

type Tab = "overview" | "conversations" | "leads" | "context" | "memory";

function fmtTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "18px 20px",
        background: "var(--bg2)",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--accent)", marginTop: 8 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [resume, setResume] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);
  const [memoryCards, setMemoryCards] = useState<OrbMemoryCard[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    const data = await res.json();
    setAuthed(data.authenticated === true);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, rRes, mRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/resume"),
        fetch("/api/admin/memory-cards"),
      ]);
      if (aRes.ok) setSummary(await aRes.json());
      if (rRes.ok) {
        const r = await rRes.json();
        setResume(r.content ?? "");
      }
      if (mRes.ok) {
        const m = await mRes.json();
        setMemoryCards(m.cards ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassword("");
    } else {
      setLoginError("Wrong password.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setSummary(null);
  };

  const saveResume = async () => {
    const res = await fetch("/api/admin/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: resume }),
    });
    if (res.ok) {
      setResumeSaved(true);
      setTimeout(() => setResumeSaved(false), 2000);
    }
  };

  const deleteCard = async (id: string) => {
    const res = await fetch("/api/admin/memory-cards", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setMemoryCards((prev) => prev.filter((c) => c.id !== id));
  };

  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", color: "var(--ink)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink3)" }}>Loading…</span>
      </div>
    );
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--ink)",
          padding: 24,
        }}
      >
        <form
          onSubmit={login}
          style={{
            width: "min(380px,100%)",
            border: "1px solid var(--line2)",
            borderRadius: 20,
            padding: "32px 28px",
            background: "var(--bg2)",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Atlas admin
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 10 }}>
            Profile dashboard
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink2)", marginTop: 8, lineHeight: 1.5 }}>
            See who&apos;s visiting, what they&apos;re asking the orb, and manage AI context.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            style={{
              width: "100%",
              marginTop: 20,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid var(--line2)",
              background: "var(--bg3)",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              outline: "none",
            }}
          />
          {loginError && <p style={{ color: "var(--accent3)", fontSize: 13, marginTop: 8 }}>{loginError}</p>}
          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px 0",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, var(--neon1), var(--accent))",
              color: "#0a0a12",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "conversations", label: "Orb chats" },
    { id: "leads", label: "Connect requests" },
    { id: "context", label: "AI context" },
    { id: "memory", label: "Memory cards" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "16px clamp(20px,5vw,48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            jaskirat.sys / admin
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginTop: 4 }}>Profile activity</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              border: "1px solid var(--line2)",
              background: "var(--bg2)",
              color: "var(--ink2)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink3)", textDecoration: "none" }}>
            ← site
          </a>
          <button
            type="button"
            onClick={logout}
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              border: "1px solid var(--line2)",
              background: "transparent",
              color: "var(--ink3)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <div style={{ padding: "12px clamp(20px,5vw,48px)", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: tab === t.id ? "1px solid var(--accent)" : "1px solid var(--line)",
              background: tab === t.id ? "var(--bg3)" : "var(--bg2)",
              color: tab === t.id ? "var(--accent)" : "var(--ink2)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main style={{ padding: "8px clamp(20px,5vw,48px) 48px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "overview" && summary && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
              <StatCard label="Page views" value={summary.pageviews.total} sub={`${summary.pageviews.today} today · ${summary.pageviews.week} this week`} />
              <StatCard label="Orb opens" value={summary.orbOpens.total} sub={`${summary.orbOpens.today} today`} />
              <StatCard label="Orb messages" value={summary.orbMessages.total} sub={`${summary.orbMessages.user} visitor · ${summary.orbMessages.assistant} replies`} />
              <StatCard label="Connect requests" value={summary.contactRequests.total} sub={`${summary.contactRequests.today} today`} />
              <StatCard label="Chat sessions" value={summary.sessions.length} />
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginTop: 36, marginBottom: 12 }}>Recent visits</h2>
            <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
              {summary.recentPageviews.length === 0 ? (
                <p style={{ padding: 20, color: "var(--ink3)", fontSize: 14 }}>No page views yet.</p>
              ) : (
                summary.recentPageviews.map((pv) => (
                  <div
                    key={pv.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink2)" }}>{pv.path}</span>
                    <span style={{ color: "var(--ink3)", flexShrink: 0 }}>{fmtTime(pv.ts)}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "conversations" && summary && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {summary.sessions.length === 0 ? (
              <p style={{ color: "var(--ink3)", fontSize: 14 }}>No orb conversations yet.</p>
            ) : (
              summary.sessions.map((s) => {
                const open = expandedSession === s.sessionId;
                const firstUser = s.messages.find((m) => m.role === "user");
                return (
                  <div key={s.sessionId} style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--bg2)", overflow: "hidden" }}>
                    <button
                      type="button"
                      onClick={() => setExpandedSession(open ? null : s.sessionId)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 18px",
                        border: "none",
                        background: "transparent",
                        color: "var(--ink)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
                          {firstUser ? firstUser.text.slice(0, 80) + (firstUser.text.length > 80 ? "…" : "") : "Opened orb"}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)", flexShrink: 0 }}>
                          {fmtTime(s.lastAt)} · {s.messages.length} msgs
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink3)", marginTop: 4 }}>
                        visitor {s.visitorId.slice(0, 8)}…
                      </div>
                    </button>
                    {open && (
                      <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                        {s.messages.map((m, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 12,
                              background: m.role === "user" ? "color-mix(in srgb, var(--accent) 12%, var(--bg3))" : "var(--bg3)",
                              border: "1px solid var(--line)",
                              fontSize: 13,
                              lineHeight: 1.5,
                            }}
                          >
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase" }}>
                              {m.role}
                            </span>
                            <div style={{ marginTop: 4 }}>{m.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "leads" && summary && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {summary.contactRequestsList.length === 0 ? (
              <p style={{ color: "var(--ink3)", fontSize: 14 }}>No connect requests yet.</p>
            ) : (
              summary.contactRequestsList.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    padding: "16px 18px",
                    background: "var(--bg2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>
                      {lead.name || "Anonymous visitor"}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)" }}>{fmtTime(lead.ts)}</span>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                        {lead.email}
                      </a>
                    )}
                    {lead.phone && <span style={{ color: "var(--ink2)" }}>{lead.phone}</span>}
                    {lead.note && (
                      <p style={{ margin: "8px 0 0", color: "var(--ink2)", lineHeight: 1.5, fontSize: 13 }}>{lead.note}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "context" && (
          <div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6, marginBottom: 16 }}>
              Experience, priorities, and facts for the orb — not just a résumé. Memory cards (proven explanations)
              live in the Memory tab and grow automatically from substantive chats. File:{" "}
              <code style={{ fontSize: 11 }}>data/orb-knowledge.md</code>
            </p>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={18}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 16,
                border: "1px solid var(--line2)",
                background: "var(--bg2)",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <button
                type="button"
                onClick={saveResume}
                style={{
                  padding: "10px 20px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, var(--neon1), var(--accent))",
                  color: "#0a0a12",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Save context
              </button>
              {resumeSaved && <span style={{ fontSize: 13, color: "var(--accent2)" }}>Saved — orb uses this on the next reply.</span>}
            </div>
          </div>
        )}

        {tab === "memory" && (
          <div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6, marginBottom: 16 }}>
              Curated explanations the orb reuses — seed cards plus auto-captured insights from substantive visitor
              questions. Delete auto cards that miss the mark; seeds are protected unless removed from{" "}
              <code style={{ fontSize: 11 }}>data/orb-memory-cards.json</code>.
            </p>
            {memoryCards.length === 0 ? (
              <p style={{ color: "var(--ink3)", fontSize: 14 }}>No memory cards yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {memoryCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 16,
                      padding: "16px 18px",
                      background: "var(--bg2)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                      <div>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{card.topic}</span>
                        <span
                          style={{
                            marginLeft: 10,
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: card.source === "seed" ? "var(--accent2)" : "var(--ink3)",
                            textTransform: "uppercase",
                          }}
                        >
                          {card.source}
                        </span>
                      </div>
                      {card.source === "auto" && (
                        <button
                          type="button"
                          onClick={() => deleteCard(card.id)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--line2)",
                            background: "transparent",
                            color: "var(--ink3)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    {card.observation && (
                      <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--ink3)", lineHeight: 1.5 }}>{card.observation}</p>
                    )}
                    <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--ink2)", lineHeight: 1.55 }}>{card.responseThatWorked}</p>
                    {card.usefulAnalogy && (
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--accent)", fontStyle: "italic" }}>
                        Analogy: {card.usefulAnalogy}
                      </p>
                    )}
                    {card.userQuestion && (
                      <p style={{ margin: "10px 0 0", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink3)" }}>
                        Q: {card.userQuestion}
                      </p>
                    )}
                    {card.ts > 0 && (
                      <p style={{ margin: "8px 0 0", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink3)" }}>
                        {fmtTime(card.ts)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
