import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ArrowRight } from "lucide-react";

// Mock data - will be replaced with real data from the backend
const mockProperties = [
  {
    id: "1",
    title: "Modern Villa in Nyarutarama",
    price: 350000,
    location: "Nyarutarama, Kigali",
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    parking: 2,
    size: 450,
    isBestDeal: false,
  },
  {
    id: "2",
    title: "Cozy Apartment in Kacyiru",
    price: 1200,
    location: "Kacyiru, Kigali",
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    size: 120,
    isBestDeal: true,
  },
  {
    id: "3",
    title: "Executive House in Kibagabaga",
    price: 280000,
    location: "Kibagabaga, Kigali",
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 380,
    isBestDeal: false,
  },
  {
    id: "4",
    title: "Luxury Penthouse in Kiyovu",
    price: 2500,
    location: "Kiyovu, Kigali",
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    size: 200,
    isBestDeal: true,
  },
  {
    id: "5",
    title: "Family Home in Kimironko",
    price: 195000,
    location: "Kimironko, Kigali",
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 320,
    isBestDeal: false,
  },
  {
    id: "6",
    title: "Studio Apartment in Remera",
    price: 800,
    location: "Remera, Kigali",
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    size: 55,
    isBestDeal: false,
  },
];

export function FeaturedProperties() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
}
