import "server-only";

/**
 * Client IP for rate limiting. X-Forwarded-For is attacker-controlled unless a trusted
 * reverse proxy appends to it, so it is only used with TRUST_PROXY=1, taking the LAST
 * entry (the one our proxy added). Without a proxy the IP is unknown → "unknown"
 * (limits then fall back to per-email only, plus the global bucket).
 */
export function getClientIp(request: Request): string {
  if (process.env.TRUST_PROXY !== "1") return "unknown";
  const xff = request.headers.get("x-forwarded-for");
  const last = xff?.split(",").map((s) => s.trim()).filter(Boolean).at(-1);
  return last ?? request.headers.get("x-real-ip") ?? "unknown";
}
