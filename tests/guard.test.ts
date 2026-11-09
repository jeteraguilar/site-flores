import { describe, expect, it } from "vitest";
import { AuthError, assertAdmin } from "@/lib/guard";
import { openingStatus } from "@/lib/opening-hours";

describe("assertAdmin", () => {
  it("401 without session", () => {
    try {
      assertAdmin(null);
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(AuthError);
      expect((e as AuthError).status).toBe(401);
    }
  });
  it("403 for non-admin", () => {
    expect(() => assertAdmin({ id: 2, email: "a@b.c", displayName: "x", role: "user" })).toThrowError(
      expect.objectContaining({ status: 403 }),
    );
  });
  it("returns the admin", () => {
    const admin = { id: 1, email: "a@b.c", displayName: "x", role: "admin" as const };
    expect(assertAdmin(admin)).toBe(admin);
  });
});

describe("openingStatus (America/Sao_Paulo)", () => {
  it("open on a weekday afternoon", () => expect(openingStatus(new Date("2026-11-10T17:00:00Z")).open).toBe(true)); // Tue 14h
  it("closed on Sunday", () => {
    const s = openingStatus(new Date("2026-11-08T15:00:00Z")); // Sun 12h
    expect(s.open).toBe(false);
    expect(s.label).toContain("amanhã");
  });
  it("Saturday closes at 17h", () => expect(openingStatus(new Date("2026-11-14T20:30:00Z")).open).toBe(false)); // Sat 17h30
  it("before opening says 'abre hoje'", () => expect(openingStatus(new Date("2026-11-10T10:00:00Z")).label).toContain("abre hoje")); // Tue 07h
});
