import { getAnalyticsSummary } from "@/lib/analytics-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listLeads, leadsDbConfigured } from "@/lib/leads-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const summary = await getAnalyticsSummary();

  // Postgres is durable; the local analytics file is wiped on every deploy.
  // Prefer the database and fall back to the file when it isn't reachable.
  if (leadsDbConfigured()) {
    const leads = await listLeads();
    if (leads.length > 0 || summary.contactRequestsList.length === 0) {
      const seen = new Set(leads.map((l) => l.id));
      const merged = [
        ...leads.map((l) => ({
          id: l.id,
          ts: l.ts,
          sessionId: l.sessionId ?? "",
          visitorId: l.visitorId ?? "",
          name: l.name,
          email: l.email,
          phone: l.phone,
          note: l.note,
        })),
        ...summary.contactRequestsList.filter((c) => !seen.has(c.id)),
      ].sort((a, b) => b.ts - a.ts);

      return Response.json({
        ...summary,
        contactRequestsList: merged,
        contactRequests: { ...summary.contactRequests, total: merged.length },
      });
    }
  }

  return Response.json(summary);
}
