import type { Lead } from "@/lib/leads-store";

const RESEND_KEY = process.env.RESEND_API_KEY?.trim();
const TO = process.env.CONTACT_NOTIFY_EMAIL?.trim() || "singhjass6404@gmail.com";
/** Resend's shared sender works with no domain setup; override once a domain is verified. */
const FROM = process.env.CONTACT_NOTIFY_FROM?.trim() || "Atlas <onboarding@resend.dev>";
const WEBHOOK = process.env.CONTACT_WEBHOOK_URL?.trim();

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 14px 6px 0;color:#6b7280;font:13px -apple-system,sans-serif;vertical-align:top">${label}</td><td style="padding:6px 0;font:14px -apple-system,sans-serif;color:#111827">${escapeHtml(value)}</td></tr>`;
}

function buildHtml(lead: Lead): string {
  const when = new Date(lead.ts).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
  const replyTo = lead.email ? `<p style="margin:18px 0 0"><a href="mailto:${encodeURIComponent(lead.email)}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font:14px -apple-system,sans-serif;display:inline-block">Reply to ${escapeHtml(lead.name || lead.email)}</a></p>` : "";
  return `<div style="max-width:560px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;font:12px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#6b7280">New connect request</p>
  <h1 style="margin:0 0 18px;font:600 22px -apple-system,sans-serif;color:#111827">${escapeHtml(lead.name || "Anonymous visitor")}</h1>
  <table style="border-collapse:collapse">
    ${row("Email", lead.email)}
    ${row("Phone", lead.phone)}
    ${row("Note", lead.note)}
    ${row("When", when)}
  </table>
  ${replyTo}
  <p style="margin:22px 0 0;font:12px -apple-system,sans-serif;color:#9ca3af">From the orb on jaskiring.up.railway.app · also saved to Postgres and visible at /admin</p>
</div>`;
}

function buildText(lead: Lead): string {
  return [
    "New connect request",
    `Name:  ${lead.name || "(not given)"}`,
    `Email: ${lead.email || "(not given)"}`,
    `Phone: ${lead.phone || "(not given)"}`,
    `Note:  ${lead.note || "(none)"}`,
    `When:  ${new Date(lead.ts).toISOString()}`,
  ].join("\n");
}

async function sendViaResend(lead: Lead): Promise<boolean> {
  if (!RESEND_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject: `Connect request — ${lead.name || lead.email || lead.phone || "anonymous"}`,
        html: buildHtml(lead),
        text: buildText(lead),
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
    });
    if (!res.ok) {
      console.error("Resend failed:", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend threw:", err instanceof Error ? err.message : err);
    return false;
  }
}

async function sendViaWebhook(lead: Lead): Promise<boolean> {
  if (!WEBHOOK) return false;
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "connect_request", ...lead }),
    });
    return res.ok;
  } catch (err) {
    console.error("Contact webhook threw:", err instanceof Error ? err.message : err);
    return false;
  }
}

export function notifyConfigured(): boolean {
  return Boolean(RESEND_KEY || WEBHOOK);
}

/** Best effort. A failed alert must never fail the visitor's submission. */
export async function notifyNewLead(lead: Lead): Promise<{ email: boolean; webhook: boolean }> {
  const [email, webhook] = await Promise.all([sendViaResend(lead), sendViaWebhook(lead)]);
  if (!email && !webhook) {
    console.error("Connect request received but no alert channel is configured or working:", lead.id);
  }
  return { email, webhook };
}
