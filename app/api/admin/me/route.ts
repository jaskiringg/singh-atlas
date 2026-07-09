import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const ok = await isAdminAuthenticated();
  return Response.json({ authenticated: ok });
}
