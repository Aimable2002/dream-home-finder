import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allProperties = [
  {
    id: "1",
    title: "Modern Villa in Kigali Heights",
    price: 450000,
    location: "Kigali Heights, Kigali",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 3200,
    type: "sale" as const,
    isBestDeal: true,
  },
  {
    id: "2",
    title: "Luxury Apartment Nyarutarama",
    price: 1500,
    location: "Nyarutarama, Kigali",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    size: 1800,
    type: "rent" as const,
    isBestDeal: false,
  },
  {
    id: "3",
    title: "Elegant Family Home",
    price: 320000,
    location: "Kimihurura, Kigali",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    bedrooms: 5,
    bathrooms: 4,
    parking: 2,
    size: 4500,
    type: "sale" as const,
    isBestDeal: true,
  },
  {
    id: "4",
    title: "Cozy Studio Apartment",
    price: 800,
    location: "Kacyiru, Kigali",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    size: 650,
    type: "rent" as const,
    isBestDeal: false,
  },
  {
    id: "5",
    title: "Premium Penthouse Suite",
    price: 3500,
    location: "Kigali City Center",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    size: 2200,
    type: "rent" as const,
    isBestDeal: true,
  },
  {
    id: "6",
    title: "Hillside Contemporary Home",
    price: 520000,
    location: "Rebero, Kigali",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 3800,
    type: "sale" as const,
    isBestDeal: false,
  },
  {
    id: "7",
    title: "Garden View Townhouse",
    price: 280000,
    location: "Gisozi, Kigali",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    size: 2100,
    type: "sale" as const,
    isBestDeal: false,
  },
  {
    id: "8",
    title: "Executive Office Space",
    price: 2500,
    location: "CBD, Kigali",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    bedrooms: 0,
    bathrooms: 2,
    parking: 3,
    size: 1500,
    type: "rent" as const,
    isBestDeal: false,
  },
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [priceRange, setPriceRange] = useState([0, 600000]);
  const [propertyType, setPropertyType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = allProperties
    .filter((property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = listingType === "all" || property.type === listingType;
      const matchesPrice = property.type === "rent" 
        ? property.price <= priceRange[1] / 100 
        : property.price >= priceRange[0] && property.price <= priceRange[1];
      return matchesSearch && matchesType && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="bg-primary py-12 md:py-16">
          <div className="container-custom text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Browse our extensive collection of premium properties across Rwanda
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by location or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background text-foreground"
                />
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-background rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-lg">Filters</h3>
                  <button 
                    className="lg:hidden text-muted-foreground"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Listing Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">Listing Type</label>
                  <div className="flex gap-2">
                    {["all", "sale", "rent"].map((type) => (
                      <Button
                        key={type}
                        variant={listingType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setListingType(type as typeof listingType)}
                        className="flex-1 capitalize"
                      >
                        {type === "all" ? "All" : type === "sale" ? "Buy" : "Rent"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={600000}
                    step={10000}
                    className="mt-4"
                  />
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">Property Type</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setListingType("all");
                    setPriceRange([0, 600000]);
                    setPropertyType("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Grid */}
              {filteredProperties.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-background rounded-xl">
                  <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                  <Button variant="link" onClick={() => {
                    setSearchQuery("");
                    setListingType("all");
                    setPriceRange([0, 600000]);
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Properties;
