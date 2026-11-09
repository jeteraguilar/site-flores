import { createSession, verifyCredentials } from "@/lib/server/auth";
import { getClientIp } from "@/lib/server/client-ip";
import { HttpError, json, parseJson, route } from "@/lib/server/http";
import { assertNotRateLimited, recordAttempt } from "@/lib/server/rate-limit";
import { loginSchema } from "@/lib/schemas";

export const POST = route(async (request) => {
  const { email, password } = await parseJson(request, loginSchema);
  const ip = getClientIp(request);
  await assertNotRateLimited("login", email, ip);
  const user = await verifyCredentials(email, password);
  await recordAttempt("login", email, ip, Boolean(user));
  if (!user) throw new HttpError(401, "E-mail ou senha incorretos.");
  await createSession(user.id);
  return json({ user });
});
