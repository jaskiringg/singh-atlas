"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OrbExtras } from "@/lib/orb-extras";
import { getOrbSessionId, getVisitorId, trackOrbOpen } from "@/lib/visitor-client";
import { OrbFlowchart, ResumeDownloadCard } from "./orb-flowcharts";

export type OrbMessage = {
  role: "user" | "assistant";
  text: string;
  extras?: OrbExtras;
};

const SIZE_PRESETS = {
  sm: { w: 320, h: 400 },
  md: { w: 400, h: 520 },
  lg: { w: 480, h: 640 },
} as const;

type SizePreset = keyof typeof SIZE_PRESETS;

const GREETING: OrbMessage = {
  role: "assistant",
  text: "Hey, I'm an AI version of Jaskirat. I think in systems, not just software. Tell me what you're building or where you're stuck, and I'll reason through it with you.",
};

function AiDisclaimerChip() {
  return (
    <div
      style={{
        marginBottom: 8,
        padding: "7px 10px",
        borderRadius: 10,
        background: "color-mix(in srgb, var(--accent) 8%, var(--bg2))",
        border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--line))",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: "var(--ink3)",
        lineHeight: 1.55,
      }}
    >
      <div style={{ color: "var(--accent)", marginBottom: 4 }}>Replying as AI Jaskirat</div>
      <div style={{ color: "var(--ink2)" }}>
        I can make mistakes — Jaskirat learns from them and won&apos;t let me repeat the same one twice.
      </div>
      <div style={{ marginTop: 5, color: "var(--ink3)" }}>
        If I&apos;m off: recruiters — weird answer = good interview question. CTOs &amp; CEOs — whiteboard sketch,
        not a SOW. Colleagues — you know the drill: ping the human for source of truth.
      </div>
    </div>
  );
}

const bookInputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg3)",
  border: "1px solid var(--line2)",
  borderRadius: 10,
  padding: "8px 11px",
  color: "var(--ink)",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  outline: "none",
};

export default function AiOrb() {
  const [orbOpen, setOrbOpen] = useState(false);
  const [orbTilt, setOrbTilt] = useState({ rx: 0, ry: 0 });
  const [orbInput, setOrbInput] = useState("");
  const [orbSending, setOrbSending] = useState(false);
  const [messages, setMessages] = useState<OrbMessage[]>([GREETING]);
  const [size, setSize] = useState<SizePreset>("md");
  const [customSize, setCustomSize] = useState<{ w: number; h: number } | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookName, setBookName] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookNote, setBookNote] = useState("");
  const [bookSending, setBookSending] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const width = customSize?.w ?? SIZE_PRESETS[size].w;
  const height = customSize?.h ?? SIZE_PRESETS[size].h;

  useEffect(() => {
    if (orbOpen) trackOrbOpen();
  }, [orbOpen]);

  const onOrbMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrbTilt({
      rx: ((e.clientY - rect.top) / rect.height - 0.5) * -22,
      ry: ((e.clientX - rect.left) / rect.width - 0.5) * 22,
    });
  };

  const sendOrbMessage = async () => {
    const text = orbInput.trim();
    if (!text || orbSending) return;
    const history = [...messages, { role: "user" as const, text }];
    setMessages(history);
    setOrbInput("");
    setOrbSending(true);
    try {
      const res = await fetch("/api/orb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, text: t }) => ({ role, text: t })),
          sessionId: getOrbSessionId(),
          visitorId: getVisitorId(),
        }),
      });
      const data = await res.json();
      let reply: OrbMessage;
      if (data.text) {
        reply = {
          role: "assistant",
          text: data.text,
          extras: data.extras,
        };
      } else if (data.error === "missing_api_key") {
        reply = {
          role: "assistant",
          text: "Orb isn't configured yet — add your OpenRouter API key to .env.local and restart the server.",
        };
      } else if (data.message) {
        reply = {
          role: "assistant",
          text: `Couldn't reach the model (${data.message}). Try again in a moment, or email me directly.`,
        };
      } else {
        reply = {
          role: "assistant",
          text: "Couldn't reach the model just now — try again in a moment, or just email me.",
        };
      }
      setMessages((m) => [...m, reply]);
      if (data.extras?.suggestBooking) setShowBookForm(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Couldn't reach the model just now — try again in a moment, or just email me.",
        },
      ]);
    } finally {
      setOrbSending(false);
    }
  };

  const submitBookSession = async () => {
    const email = bookEmail.trim();
    const phone = bookPhone.trim();
    if (!email && !phone) return;
    setBookSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getOrbSessionId(),
          visitorId: getVisitorId(),
          name: bookName.trim() || undefined,
          email: email || undefined,
          phone: phone || undefined,
          note: bookNote.trim() || undefined,
        }),
      });
      if (res.ok) {
        setShowBookForm(false);
        setBookName("");
        setBookEmail("");
        setBookPhone("");
        setBookNote("");
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: "Got it — I've logged your details. I'll reach out soon. Looking forward to connecting.",
          },
        ]);
      } else {
        const data = await res.json();
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: data.error === "invalid email"
              ? "That email doesn't look right — try again or use your phone number."
              : "Couldn't save your request just now. Try again or email singhjass6404@gmail.com directly.",
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Couldn't save your request — try again or email singhjass6404@gmail.com directly.",
        },
      ]);
    } finally {
      setBookSending(false);
    }
  };

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = width;
    const startH = height;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setCustomSize({
        w: Math.min(560, Math.max(300, startW + dx)),
        h: Math.min(780, Math.max(360, startH + dy)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [width, height]);

  const setPreset = (p: SizePreset) => {
    setSize(p);
    setCustomSize(null);
  };

  const openConnect = () => {
    setOrbOpen(true);
    setShowBookForm(true);
  };

  const ConnectSphere = ({ small = false }: { small?: boolean }) => (
    <>
      <div style={{ position: "absolute", left: "50%", bottom: small ? -9 : -14, width: small ? 24 : 38, height: small ? 6 : 10, background: "radial-gradient(closest-side, rgba(0,0,0,.4), transparent)", transform: "translateX(-50%)", borderRadius: "50%" }} />
      <div className="pt-orb-sonar" />
      <div className="pt-orb-sonar pt-orb-sonar--delay" />
      <div className="pt-orb-halo" />
      <div className="pt-orb-body">
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 78% 76%, color-mix(in srgb, var(--neon1) 30%, transparent) 0%, transparent 46%)", mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", top: small ? 5 : 9, left: small ? 6 : 11, width: small ? 9 : 15, height: small ? 6 : 10, borderRadius: "50%", background: "rgba(255,255,255,.45)", filter: "blur(3px)" }} />
    </>
  );

  return (
    <div className="pt-orb-wrap" onMouseMove={onOrbMove} onMouseLeave={() => setOrbTilt({ rx: 0, ry: 0 })}>
      {orbOpen && (
        <div
          ref={panelRef}
          className="pt-orb-panel pt-orb-panel--resizable"
          style={{ width, height, display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid var(--line)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon1)", boxShadow: "0 0 8px var(--neon1)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Talk to Jaskirat</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {(["sm", "md", "lg"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreset(p)}
                  title={`Size ${p.toUpperCase()}`}
                  style={{
                    border: size === p && !customSize ? "1px solid var(--accent)" : "1px solid var(--line2)",
                    background: size === p && !customSize ? "var(--bg3)" : "transparent",
                    borderRadius: 6,
                    padding: "2px 7px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--ink3)",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {p}
                </button>
              ))}
              <button type="button" onClick={() => setOrbOpen(false)} style={{ all: "unset", cursor: "pointer", color: "var(--ink3)", fontFamily: "var(--font-mono)", fontSize: 16, padding: "0 4px", marginLeft: 4 }}>
                ×
              </button>
            </div>
          </div>
          <div style={{ padding: "8px 14px 0", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0, fontSize: "11.5px", color: "var(--ink3)", lineHeight: 1.4 }}>
              Systems, architecture, AI, products — I&apos;ll ask before I assume.
            </p>
            <button
              type="button"
              onClick={() => setShowBookForm((v) => !v)}
              style={{
                alignSelf: "flex-start",
                border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--line2))",
                borderRadius: 999,
                padding: "6px 14px",
                background: showBookForm ? "color-mix(in srgb, var(--accent) 12%, var(--bg3))" : "var(--bg2)",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {showBookForm ? "Cancel" : "Connect"}
            </button>
            {showBookForm && (
              <div
                style={{
                  border: "1px solid var(--line2)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "var(--bg2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>Connect</div>
                <div style={{ fontSize: 11, color: "var(--ink3)" }}>Leave email or phone — I&apos;ll follow up.</div>
                <input
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="Your name (optional)"
                  style={bookInputStyle}
                />
                <input
                  value={bookEmail}
                  onChange={(e) => setBookEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  style={bookInputStyle}
                />
                <input
                  value={bookPhone}
                  onChange={(e) => setBookPhone(e.target.value)}
                  placeholder="Phone / WhatsApp"
                  type="tel"
                  style={bookInputStyle}
                />
                <textarea
                  value={bookNote}
                  onChange={(e) => setBookNote(e.target.value)}
                  placeholder="What do you want to discuss? (optional)"
                  rows={2}
                  style={{ ...bookInputStyle, resize: "vertical", minHeight: 52 }}
                />
                <button
                  type="button"
                  onClick={submitBookSession}
                  disabled={bookSending || (!bookEmail.trim() && !bookPhone.trim())}
                  style={{
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 0",
                    background: "linear-gradient(135deg, var(--neon1), var(--accent))",
                    color: "#0a0a12",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: 12,
                    cursor: bookSending ? "wait" : "pointer",
                    opacity: !bookEmail.trim() && !bookPhone.trim() ? 0.5 : 1,
                  }}
                >
                  {bookSending ? "Sending…" : "Connect"}
                </button>
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "92%",
                    padding: "10px 13px",
                    borderRadius: 16,
                    fontSize: "13.5px",
                    lineHeight: 1.5,
                    background: m.role === "user" ? "color-mix(in srgb, var(--accent) 16%, var(--bg3))" : "var(--bg3)",
                    border: m.role === "user" ? "1px solid color-mix(in srgb, var(--accent) 40%, var(--line2))" : "1px solid var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  {m.role === "assistant" && m.text !== GREETING.text && <AiDisclaimerChip />}
                  {m.text}
                  {m.role === "assistant" && m.extras?.flowchart && <OrbFlowchart id={m.extras.flowchart} />}
                  {m.role === "assistant" && m.extras?.showResume && <ResumeDownloadCard />}
                </div>
              </div>
            ))}
            {orbSending && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 13px", borderRadius: 14, background: "var(--bg3)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink3)" }}>
                  thinking…
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--line)", flexShrink: 0 }}>
            <input
              value={orbInput}
              onChange={(e) => setOrbInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendOrbMessage();
                }
              }}
              placeholder="What are you building?"
              style={{
                flex: 1,
                background: "var(--bg3)",
                border: "1px solid var(--line2)",
                borderRadius: 14,
                padding: "10px 13px",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={sendOrbMessage}
              disabled={orbSending}
              style={{
                border: "none",
                borderRadius: 14,
                padding: "0 16px",
                background: "linear-gradient(135deg, var(--neon1), var(--accent))",
                color: "#0a0a12",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
          <div
            className="pt-orb-resize-handle"
            onMouseDown={onResizeStart}
            title="Drag to resize"
            role="separator"
            aria-orientation="horizontal"
          />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <div
            className="pt-orb-sphere-wrap pt-orb-sphere-wrap--sm"
            onClick={openConnect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openConnect()}
            aria-label="Connect with Jaskirat"
          >
            <ConnectSphere small />
          </div>
          <span className="pt-orb-label pt-orb-label--sm">connect</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
          <div
            style={{
              transform: `perspective(700px) rotateX(${orbTilt.rx}deg) rotateY(${orbTilt.ry}deg) scale(${orbOpen ? 0.86 : 1})`,
              transition: "transform .25s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <div className="pt-orb-sphere-wrap" onClick={() => setOrbOpen((o) => !o)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOrbOpen((o) => !o)}>
              <ConnectSphere />
            </div>
          </div>
          <span className="pt-orb-label">talk to me</span>
        </div>
      </div>
    </div>
  );
}
