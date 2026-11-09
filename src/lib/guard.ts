import type { SessionUser } from "./types";

export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
  }
}

/** Pure admin guard: 401 without a session, 403 for non-admin roles. */
export function assertAdmin(user: SessionUser | null): SessionUser {
  if (!user) throw new AuthError(401, "Faça login para continuar.");
  if (user.role !== "admin") throw new AuthError(403, "Acesso restrito à administração da loja.");
  return user;
}
