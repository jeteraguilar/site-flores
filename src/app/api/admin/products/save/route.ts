import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { HttpError, json, parseJson, route } from "@/lib/server/http";
import { productSchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  await requireAdmin();
  const { id, ...values } = await parseJson(request, productSchema);
  const db = getDb();
  const row = id
    ? await db.updateTable("products").set({ ...values, updatedAt: new Date() }).where("id", "=", id)
        .returning("id").executeTakeFirst()
    : await db.insertInto("products").values(values).returning("id").executeTakeFirst();
  if (!row) throw new HttpError(404, "Produto não encontrado.");
  return json({ id: row.id });
});
