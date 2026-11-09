import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { HttpError, json, parseJson, route } from "@/lib/server/http";
import { idSchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  await requireAdmin();
  const { id } = await parseJson(request, idSchema);
  const result = await getDb().deleteFrom("notices").where("id", "=", id).executeTakeFirst();
  if (result.numDeletedRows === BigInt(0)) throw new HttpError(404, "Registro não encontrado.");
  return json({ ok: true });
});
