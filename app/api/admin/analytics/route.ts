import { getAnalyticsSummary } from "@/lib/analytics-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const summary = await getAnalyticsSummary();
  return Response.json(summary);
}
