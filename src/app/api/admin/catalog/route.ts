import { requireAdmin } from "@/lib/server/auth";
import { getAdminCatalog } from "@/lib/server/catalog";
import { json, route } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  await requireAdmin();
  return json(await getAdminCatalog(), { headers: { "Cache-Control": "no-store" } });
});
