import { cookies } from "next/headers";
import { clearAdminCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const jar = await cookies();
  jar.set(clearAdminCookieOptions());
  return Response.json({ ok: true });
}
