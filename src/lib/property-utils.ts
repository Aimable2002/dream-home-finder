import type { PropertyWithImages } from "@/lib/api";
import type { PropertyCardProps } from "@/components/property/PropertyCard";
import { publicOrigin } from "@/lib/seo";

const FALLBACK_IMAGE = "/placeholder.svg";

export function matchesPropertyLocation(location: string, query: string): boolean {
  return location.toLowerCase().includes(query.trim().toLowerCase());
}

export function coverImageUrl(property: PropertyWithImages): string {
  const cover = property.property_images.find((img) => img.is_cover);
  return cover?.url ?? property.property_images[0]?.url ?? FALLBACK_IMAGE;
}

export function toPropertyCardProps(property: PropertyWithImages): PropertyCardProps {
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    location: property.location,
    type: property.type,
    image: coverImageUrl(property),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parking: property.parking,
    size: property.size ?? 0,
    isBestDeal: property.is_best_deal,
  };
}

export function formatPrice(price: number, type: "sale" | "rent"): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return type === "rent" ? `${formatted}/mo` : formatted;
}

export function propertyWhatsAppUrl(
  number: string | null | undefined,
  property: PropertyCardProps,
): string | null {
  const digits = number?.replace(/[\s()+.-]/g, "") ?? "";
  if (!/^[1-9]\d{6,14}$/.test(digits)) return null;
  const detailsUrl = `${publicOrigin}/property/${encodeURIComponent(property.id)}`;
  const imageUrl = new URL(property.image, publicOrigin).href;
  const message = [
    `Hello ImenaHomes, I'm interested in this property:`,
    property.title,
    `For ${property.type === "sale" ? "sale" : "rent"} — ${formatPrice(property.price, property.type)}`,
    `Location: ${property.location}`,
    `Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms} | Parking: ${property.parking}`,
    ...(property.size > 0 ? [`Size: ${property.size} m²`] : []),
    `Photo: ${imageUrl}`,
    `Property details: ${detailsUrl}`,
  ].join("\n");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}