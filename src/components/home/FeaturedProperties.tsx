import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { getProperties, type PropertyWithImages } from "@/lib/api";
import { toPropertyCardProps } from "@/lib/property-utils";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProperties({ limit: 6 })
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Our Portfolio
            </span>
            <h2 className="heading-2 text-foreground mt-2">
              Featured Properties
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Explore our handpicked selection of premium properties across Rwanda's most desirable locations.
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...toPropertyCardProps(property)} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-16">
            No properties listed yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}