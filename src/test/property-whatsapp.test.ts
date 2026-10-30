import { describe, expect, it } from "vitest";
import { propertyWhatsAppUrl } from "@/lib/property-utils";
import type { PropertyCardProps } from "@/components/property/PropertyCard";

const property: PropertyCardProps = {
  id: "listing-123", title: "Kigali Family Home", price: 1200,
  location: "Kimironko, Kigali", type: "rent", image: "https://images.example.test/home.jpg",
  bedrooms: 3, bathrooms: 2, parking: 1, size: 150,
};

describe("property WhatsApp contact", () => {
  it("uses the owner's configured number without formatting", () => {
    const href = propertyWhatsAppUrl("+250 (788) 123-456", property);
    expect(href && new URL(href).pathname).toBe("/250788123456");
  });
  it("includes the selected listing details", () => {
    const href = propertyWhatsAppUrl("250788123456", property);
    const text = href && new URL(href).searchParams.get("text");
    expect(text).toContain("Kigali Family Home");
    expect(text).toContain("Kimironko, Kigali");
    expect(text).toContain("$1,200/mo");
    expect(text).toContain("Bedrooms: 3 | Bathrooms: 2 | Parking: 1");
  });
  it("includes the selected photo URL", () => {
    const href = propertyWhatsAppUrl("250788123456", property);
    expect(href && new URL(href).searchParams.get("text")).toContain("Photo: https://images.example.test/home.jpg");
  });
  it("includes the production link to the selected listing", () => {
    const href = propertyWhatsAppUrl("250788123456", property);
    expect(href && new URL(href).searchParams.get("text")).toContain("Property details: https://imenahomes.site/property/listing-123");
  });
  it("never substitutes an invented contact number", () => {
    expect(propertyWhatsAppUrl(null, property)).toBeNull();
    expect(propertyWhatsAppUrl("invalid", property)).toBeNull();
  });
});