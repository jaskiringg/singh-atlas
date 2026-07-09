import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readKnowledgeForAdmin, writeKnowledgeFromAdmin } from "@/lib/orb-context";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await readKnowledgeForAdmin();
  return Response.json({ content });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content } = await req.json();
    if (typeof content !== "string") {
      return Response.json({ error: "content required" }, { status: 400 });
    }
    await writeKnowledgeFromAdmin(content);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
