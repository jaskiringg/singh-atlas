import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteMemoryCard, listMemoryCards } from "@/lib/orb-memory-cards";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cards = await listMemoryCards();
  return Response.json({ cards });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (typeof id !== "string" || !id) {
      return Response.json({ error: "id required" }, { status: 400 });
    }
    const ok = await deleteMemoryCard(id);
    if (!ok) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
}
