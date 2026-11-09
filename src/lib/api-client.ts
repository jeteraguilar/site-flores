/** Small typed fetch wrapper for the browser. Throws Error(message) on non-2xx. */
export async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    const err = new Error(data.error ?? `Falha na requisição (${res.status}).`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}
