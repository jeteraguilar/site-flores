/** Pure text/format helpers shared by server and client (tested in tests/text.test.ts). */

export const normalizeSearch = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export const slugify = (s: string) =>
  normalizeSearch(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Parses "49,90", "1.234,56", "49.9" or "49" → number. Empty → null. Invalid → NaN. */
export function parsePriceBR(input: string): number | null {
  const raw = input.trim().replace(/^R\$\s*/i, "");
  if (!raw) return null;
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(raw)) return Number.NaN;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Number(normalized);
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (value: number | string) => brl.format(Number(value));

/** Today's date (YYYY-MM-DD) in the store's time zone. */
export function todayInSaoPaulo(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export type NoticeWindow = { active: boolean; startsAt: string | null; endsAt: string | null };

/** A notice is visible when active and today ∈ [startsAt, endsAt] (open-ended bounds allowed). */
export function isNoticeVisible(n: NoticeWindow, today: string): boolean {
  if (!n.active) return false;
  if (n.startsAt && n.startsAt > today) return false;
  if (n.endsAt && n.endsAt < today) return false;
  return true;
}

const fmtDay = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export function describeNoticePeriod(startsAt: string | null, endsAt: string | null): string {
  if (startsAt && endsAt) return `de ${fmtDay(startsAt)} a ${fmtDay(endsAt)}`;
  if (startsAt) return `a partir de ${fmtDay(startsAt)}`;
  if (endsAt) return `até ${fmtDay(endsAt)}`;
  return "sem data de término";
}
