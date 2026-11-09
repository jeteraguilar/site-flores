import { describe, expect, it } from "vitest";
import { categorySchema, noticeSchema, productSchema, uploadUrlSchema } from "@/lib/schemas";

const product = { categoryId: 1, name: "Buquê", description: "", imageUrl: null, priceFrom: 49.9, featured: false, active: true, sortOrder: 0 };

describe("productSchema", () => {
  it("accepts a valid product and turns empty text into null", () => {
    const parsed = productSchema.parse(product);
    expect(parsed.description).toBeNull();
  });
  it("rejects negative prices", () => expect(productSchema.safeParse({ ...product, priceFrom: -1 }).success).toBe(false));
  it("accepts a missing price (consulte valores)", () => expect(productSchema.safeParse({ ...product, priceFrom: null }).success).toBe(true));
  it("rejects short names", () => expect(productSchema.safeParse({ ...product, name: "a" }).success).toBe(false));
});

describe("categorySchema slug", () => {
  const base = { name: "Cactos", description: null, imageUrl: null, active: true, sortOrder: 1 };
  it.each(["cactos", "cactos-e-suculentas", "vasos2"])("accepts %s", (slug) => expect(categorySchema.safeParse({ ...base, slug }).success).toBe(true));
  it.each(["Cactos", "cactos_e", "-cactos", "cactos-", "ca--ctos", "cáctos"])("rejects %s", (slug) =>
    expect(categorySchema.safeParse({ ...base, slug }).success).toBe(false));
});

describe("noticeSchema dates", () => {
  const base = { message: "Fechados no feriado", active: true };
  it("accepts an ordered window", () => expect(noticeSchema.safeParse({ ...base, startsAt: "2026-12-24", endsAt: "2026-12-26" }).success).toBe(true));
  it("rejects end before start", () => expect(noticeSchema.safeParse({ ...base, startsAt: "2026-12-26", endsAt: "2026-12-24" }).success).toBe(false));
  it("rejects malformed dates", () => expect(noticeSchema.safeParse({ ...base, startsAt: "24/12/2026", endsAt: null }).success).toBe(false));
  it("rejects impossible dates", () => expect(noticeSchema.safeParse({ ...base, startsAt: "2026-13-40", endsAt: null }).success).toBe(false));
});

describe("uploadUrlSchema", () => {
  it("rejects SVG/HTML uploads", () => expect(uploadUrlSchema.safeParse({ contentType: "image/svg+xml", sizeBytes: 10 }).success).toBe(false));
  it("rejects files over 8 MB", () => expect(uploadUrlSchema.safeParse({ contentType: "image/png", sizeBytes: 9 * 1024 * 1024 }).success).toBe(false));
});
