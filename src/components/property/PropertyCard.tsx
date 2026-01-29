import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Car, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DealBadge } from "./DealBadge";

export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  type: "rent" | "sale";
  image: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size: number;
  isBestDeal?: boolean;
}

export function PropertyCard({
  id,
  title,
  price,
  location,
  type,
  image,
  bedrooms,
  bathrooms,
  parking,
  size,
  isBestDeal = false,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/property/${id}`}>
      <Card className="group overflow-hidden border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Type Badge */}
          <Badge
            className={`absolute top-3 left-3 ${
              type === "sale"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            For {type === "sale" ? "Sale" : "Rent"}
          </Badge>
          
          {/* Best Deal Badge */}
          {isBestDeal && (
            <div className="absolute top-3 right-3">
              <DealBadge />
            </div>
          )}
          
          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <span className="text-white font-heading font-bold text-xl">
              {formatPrice(price)}
              {type === "rent" && <span className="text-sm font-normal">/mo</span>}
            </span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-1 mb-2 group-hover:text-secondary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          
          {/* Features */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-3">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{parking}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{size}m²</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
