import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { HttpError, json, parseJson, route } from "@/lib/server/http";
import { noticeSchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  await requireAdmin();
  const { id, ...values } = await parseJson(request, noticeSchema);
  const db = getDb();
  const row = id
    ? await db.updateTable("notices").set(values).where("id", "=", id).returning("id").executeTakeFirst()
    : await db.insertInto("notices").values(values).returning("id").executeTakeFirst();
  if (!row) throw new HttpError(404, "Aviso não encontrado.");
  return json({ id: row.id });
});
