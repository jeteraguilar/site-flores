import "server-only";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sql } from "kysely";
import { getDb } from "./db";
import { HttpError } from "./http";
import { AuthError, assertAdmin } from "../guard";
import type { SessionUser } from "../types";

export const SESSION_COOKIE = "rd_session";
const SESSION_DAYS = 7;
const RESET_CODE_MINUTES = 15;
const RESET_MAX_ATTEMPTS = 5;

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

// Used to keep login timing similar whether or not the account exists.
const DUMMY_HASH = "$2b$12$DcotRgOQbMJR8NCQGqFqqeejtBplau2NEEzMe8HIJRcekjjku66kO";

export async function verifyCredentials(email: string, password: string): Promise<SessionUser | null> {
  const user = await getDb()
    .selectFrom("users")
    .select(["id", "email", "displayName", "role", "passwordHash"])
    .where(sql<boolean>`lower(email) = ${email.toLowerCase()}`)
    .executeTakeFirst();
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) return null;
  return { id: user.id, email: user.email, displayName: user.displayName, role: user.role };
}

/** Creates a session; only the SHA-256 of the token is stored in the database. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await getDb().insertInto("sessions").values({ id: sha256(token), userId, expiresAt }).execute();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await getDb().deleteFrom("sessions").where("id", "=", sha256(token)).execute();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = getDb();
  const row = await db
    .selectFrom("sessions")
    .innerJoin("users", "users.id", "sessions.userId")
    .select(["users.id", "users.email", "users.displayName", "users.role", "sessions.lastAccessed"])
    .where("sessions.id", "=", sha256(token))
    .where("sessions.expiresAt", ">", new Date())
    .executeTakeFirst();
  if (!row) return null;
  // Sliding expiration, written at most once per hour.
  if (Date.now() - new Date(row.lastAccessed).getTime() > 3_600_000) {
    await db
      .updateTable("sessions")
      .set({ lastAccessed: new Date(), expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000) })
      .where("id", "=", sha256(token))
      .execute();
  }
  return { id: row.id, email: row.email, displayName: row.displayName, role: row.role };
}

/** For API routes: resolves the admin or throws an HttpError (401/403). */
export async function requireAdmin(): Promise<SessionUser> {
  try {
    return assertAdmin(await getCurrentUser());
  } catch (e) {
    if (e instanceof AuthError) throw new HttpError(e.status, e.message);
    throw e;
  }
}

/* ----------------------------- Password reset ---------------------------- */

/** Returns the plain 6-digit code (to be emailed) or null when the e-mail is unknown. */
export async function issueResetCode(email: string): Promise<{ code: string; email: string } | null> {
  const db = getDb();
  const user = await db
    .selectFrom("users")
    .select(["id", "email"])
    .where(sql<boolean>`lower(email) = ${email.toLowerCase()}`)
    .executeTakeFirst();
  if (!user) return null;
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db.transaction().execute(async (trx) => {
    // Only the newest code is valid.
    await trx.updateTable("passwordResetCodes").set({ usedAt: new Date() })
      .where("userId", "=", user.id).where("usedAt", "is", null).execute();
    await trx.insertInto("passwordResetCodes").values({
      userId: user.id,
      codeHash: sha256(code),
      expiresAt: new Date(Date.now() + RESET_CODE_MINUTES * 60_000),
    }).execute();
  });
  return { code, email: user.email };
}

export async function resetPasswordWithCode(email: string, code: string, newPassword: string) {
  const db = getDb();
  const invalid = new HttpError(400, "Código inválido ou expirado.");
  const row = await db
    .selectFrom("passwordResetCodes")
    .innerJoin("users", "users.id", "passwordResetCodes.userId")
    .select(["passwordResetCodes.id", "passwordResetCodes.codeHash", "passwordResetCodes.attempts", "users.id as userId"])
    .where(sql<boolean>`lower(users.email) = ${email.toLowerCase()}`)
    .where("passwordResetCodes.usedAt", "is", null)
    .where("passwordResetCodes.expiresAt", ">", new Date())
    .orderBy("passwordResetCodes.createdAt", "desc")
    .executeTakeFirst();
  if (!row || row.attempts >= RESET_MAX_ATTEMPTS) throw invalid;

  const match = timingSafeEqual(Buffer.from(row.codeHash, "hex"), Buffer.from(sha256(code), "hex"));
  if (!match) {
    await db.updateTable("passwordResetCodes").set((eb) => ({ attempts: eb("attempts", "+", 1) }))
      .where("id", "=", row.id).execute();
    throw invalid;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.transaction().execute(async (trx) => {
    await trx.updateTable("passwordResetCodes").set({ usedAt: new Date() }).where("id", "=", row.id).execute();
    await trx.updateTable("users").set({ passwordHash, updatedAt: new Date() }).where("id", "=", row.userId).execute();
    // Revoke every existing session after a password change.
    await trx.deleteFrom("sessions").where("userId", "=", row.userId).execute();
  });
}
