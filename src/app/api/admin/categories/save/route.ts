import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { HttpError, json, parseJson, route } from "@/lib/server/http";
import { categorySchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  await requireAdmin();
  const { id, ...values } = await parseJson(request, categorySchema);
  const db = getDb();
  const row = id
    ? await db.updateTable("categories").set(values).where("id", "=", id).returning("id").executeTakeFirst()
    : await db.insertInto("categories").values(values).returning("id").executeTakeFirst();
  if (!row) throw new HttpError(404, "Categoria não encontrada.");
  return json({ id: row.id });
});
