import { getPublicCatalog } from "@/lib/server/catalog";
import { json, route } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async () =>
  json(await getPublicCatalog(), { headers: { "Cache-Control": "public, max-age=60" } }),
);
