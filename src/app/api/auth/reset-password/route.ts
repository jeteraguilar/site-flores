import { resetPasswordWithCode } from "@/lib/server/auth";
import { json, parseJson, route } from "@/lib/server/http";
import { resetPasswordSchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  const { email, code, newPassword } = await parseJson(request, resetPasswordSchema);
  await resetPasswordWithCode(email, code, newPassword);
  return json({ ok: true });
});
