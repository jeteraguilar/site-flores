import { issueResetCode } from "@/lib/server/auth";
import { getClientIp } from "@/lib/server/client-ip";
import { json, parseJson, route } from "@/lib/server/http";
import { sendResetCode } from "@/lib/server/mailer";
import { assertNotRateLimited, recordAttempt } from "@/lib/server/rate-limit";
import { resetRequestSchema } from "@/lib/schemas";

const SAME_RESPONSE = { ok: true, message: "Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos." };

export const POST = route(async (request) => {
  const { email } = await parseJson(request, resetRequestSchema);
  const ip = getClientIp(request);
  await assertNotRateLimited("reset", email, ip);
  await recordAttempt("reset", email, ip, true);
  const issued = await issueResetCode(email);
  if (issued) {
    try {
      await sendResetCode(issued.email, issued.code);
    } catch (err) {
      console.error("[mail] falha ao enviar código", err);
    }
  }
  // Same body whether or not the account exists (no user enumeration).
  return json(SAME_RESPONSE);
});
