import "server-only";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const json = <T>(data: T, init?: ResponseInit) => NextResponse.json(data, init);

const MAX_BODY_BYTES = 64 * 1024;

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) throw new HttpError(413, "Requisição muito grande.");
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "JSON inválido.");
  }
  return schema.parse(body);
}

/** Maps any thrown error to `{ error }` with a proper status; never leaks internals. */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) return json({ error: error.message }, { status: error.status });
  if (error instanceof ZodError) {
    return json({ error: error.issues.map((i) => i.message).join(" ") }, { status: 400 });
  }
  const code = (error as { code?: string } | null)?.code;
  if (code === "23505") return json({ error: "Já existe um registro com esse identificador." }, { status: 409 });
  if (code === "23503") return json({ error: "Não é possível remover: existem itens vinculados." }, { status: 409 });
  console.error("[api] unexpected error", error);
  return json({ error: "Erro inesperado. Tente novamente." }, { status: 500 });
}

type Handler = (request: Request) => Promise<Response>;

/** Defense in depth against CSRF (cookies are already SameSite=Lax). */
function assertSameOrigin(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") return;
  const origin = request.headers.get("origin");
  if (!origin) return; // non-browser clients
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new HttpError(403, "Origem inválida.");
  }
  if (originHost !== host) throw new HttpError(403, "Origem não permitida.");
}

export const route =
  (handler: Handler): Handler =>
  async (request) => {
    try {
      assertSameOrigin(request);
      return await handler(request);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
