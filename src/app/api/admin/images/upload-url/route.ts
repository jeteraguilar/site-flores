import { requireAdmin } from "@/lib/server/auth";
import { json, parseJson, route } from "@/lib/server/http";
import { createImageUploadUrl } from "@/lib/server/storage";
import { uploadUrlSchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  await requireAdmin();
  const { contentType, sizeBytes } = await parseJson(request, uploadUrlSchema);
  return json(await createImageUploadUrl(contentType, sizeBytes));
});
