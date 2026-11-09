import "server-only";
import { sql } from "kysely";
import { getDb } from "./db";
import { HttpError } from "./http";

const WINDOW_MINUTES = 15;
const LIMITS = { login: { email: 5, ip: 30 }, reset: { email: 3, ip: 10 } } as const;

/** DB-backed limiter (works across instances). Counts failed attempts in a sliding window. */
export async function assertNotRateLimited(kind: "login" | "reset", email: string, ip: string) {
  const db = getDb();
  const since = sql<Date>`now() - make_interval(mins => ${WINDOW_MINUTES})`;
  const failed = kind === "login" ? [false] : [false, true]; // resets count every request
  const [byEmail, byIp] = await Promise.all([
    db
      .selectFrom("loginAttempts")
      .select((eb) => eb.fn.countAll<string>().as("n"))
      .where("kind", "=", kind)
      .where(sql<boolean>`lower(email) = ${email.toLowerCase()}`)
      .where("success", "in", failed)
      .where("attemptedAt", ">", since)
      .executeTakeFirstOrThrow(),
    ip === "unknown"
      ? Promise.resolve({ n: "0" })
      : db
          .selectFrom("loginAttempts")
          .select((eb) => eb.fn.countAll<string>().as("n"))
          .where("kind", "=", kind)
          .where("ip", "=", ip)
          .where("success", "in", failed)
          .where("attemptedAt", ">", since)
          .executeTakeFirstOrThrow(),
  ]);
  if (Number(byEmail.n) >= LIMITS[kind].email || Number(byIp.n) >= LIMITS[kind].ip) {
    throw new HttpError(429, `Muitas tentativas. Aguarde ${WINDOW_MINUTES} minutos e tente de novo.`);
  }
}

export async function recordAttempt(kind: "login" | "reset", email: string, ip: string, success: boolean) {
  await getDb().insertInto("loginAttempts").values({ kind, email: email.toLowerCase(), ip, success }).execute();
}
