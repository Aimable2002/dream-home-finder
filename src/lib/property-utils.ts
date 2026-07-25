import type { PropertyWithImages } from "@/lib/api";
import type { PropertyCardProps } from "@/components/property/PropertyCard";

const FALLBACK_IMAGE = "/placeholder.svg";

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