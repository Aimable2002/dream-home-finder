import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PropertyCardProps } from "./PropertyCard";
import { getSettings } from "@/lib/api";
import { propertyWhatsAppUrl } from "@/lib/property-utils";

export function PropertyWhatsAppButton({ property }: { property: PropertyCardProps }) {
  const { data: settings, isPending } = useQuery({
    queryKey: ["property-contact-settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });
  const href = propertyWhatsAppUrl(settings?.whatsapp, property);

  if (!href) {
    return (
      <Button disabled size="sm" className="w-full" title={isPending ? "Loading contact number" : "WhatsApp number unavailable"}>
        <MessageCircle aria-hidden="true" /> WhatsApp
      </Button>
    );
  }

  return (
    <Button asChild size="sm" className="w-full">
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Contact ImenaHomes on WhatsApp about ${property.title}`}>
        <MessageCircle aria-hidden="true" /> WhatsApp
      </a>
    </Button>
  );
}