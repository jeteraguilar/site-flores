import { describe, expect, it } from "vitest";
import {
  describeNoticePeriod,
  formatBRL,
  isNoticeVisible,
  normalizeSearch,
  parsePriceBR,
  slugify,
  todayInSaoPaulo,
} from "@/lib/text";

describe("parsePriceBR", () => {
  it.each([
    ["49,90", 49.9],
    ["49.90", 49.9],
    ["49", 49],
    ["1.234,56", 1234.56],
    ["R$ 12,5", 12.5],
  ])("parses %s", (input, expected) => expect(parsePriceBR(input)).toBe(expected));

  it("returns null when empty", () => expect(parsePriceBR("   ")).toBeNull());
  it.each(["abc", "12,345", "1,2,3", "-5"])("rejects %s", (input) => expect(parsePriceBR(input)).toBeNaN());
});

describe("search & slug", () => {
  it("ignores accents and case", () => expect(normalizeSearch("  Frutíferas ÁRVORE ")).toBe("frutiferas arvore"));
  it("slugifies names", () => expect(slugify("Vasos, Insumos & Acessórios")).toBe("vasos-insumos-acessorios"));
});

describe("isNoticeVisible", () => {
  const today = "2026-11-10";
  it("shows open-ended active notices", () => expect(isNoticeVisible({ active: true, startsAt: null, endsAt: null }, today)).toBe(true));
  it("hides inactive notices", () => expect(isNoticeVisible({ active: false, startsAt: null, endsAt: null }, today)).toBe(false));
  it("hides notices not started yet", () => expect(isNoticeVisible({ active: true, startsAt: "2026-11-11", endsAt: null }, today)).toBe(false));
  it("hides expired notices", () => expect(isNoticeVisible({ active: true, startsAt: null, endsAt: "2026-11-09" }, today)).toBe(false));
  it("includes both boundary days", () => {
    expect(isNoticeVisible({ active: true, startsAt: today, endsAt: today }, today)).toBe(true);
  });
});

describe("dates & money", () => {
  it("uses São Paulo time zone for 'today'", () => {
    // 02:00 UTC on Nov 10 is still Nov 9 in São Paulo (UTC-3)
    expect(todayInSaoPaulo(new Date("2026-11-10T02:00:00Z"))).toBe("2026-11-09");
  });
  it("describes periods", () => {
    expect(describeNoticePeriod("2026-12-24", "2026-12-26")).toBe("de 24/12/2026 a 26/12/2026");
    expect(describeNoticePeriod(null, null)).toBe("sem data de término");
  });
  it("formats BRL", () => expect(formatBRL(49.9).replace(/\s/g, " ")).toBe("R$ 49,90"));
});
