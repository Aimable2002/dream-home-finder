import { describe, expect, it } from "vitest";
import { matchesPropertyLocation } from "@/lib/property-utils";

describe("property location filter", () => {
  it("filters by location regardless of case and surrounding spaces", () => {
    expect(matchesPropertyLocation("Kigali, Kimironko", " KIMIRONKO ")).toBe(true);
    expect(matchesPropertyLocation("Musanze", "Kimironko")).toBe(false);
    expect(matchesPropertyLocation("Musanze", "")).toBe(true);
  });
});