import { cookies } from "next/headers";
import { adminCookieOptions, signAdminToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return Response.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });
  }

  try {
    const { password } = await req.json();
    if (password !== secret) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = signAdminToken(secret);
    const jar = await cookies();
    jar.set(adminCookieOptions(token));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
