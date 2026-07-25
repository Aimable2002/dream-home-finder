import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProperties, type PropertyWithImages, type PropertyType } from "@/lib/api";
import { toPropertyCardProps } from "@/lib/property-utils";

const Properties = () => {
  const [allProperties, setAllProperties] = useState<PropertyWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [priceRange, setPriceRange] = useState([0, 600000]);
  const [propertyType, setPropertyType] = useState<"all" | PropertyType>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProperties()
      .then(setAllProperties)
      .catch(() => setAllProperties([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProperties = useMemo(() => {
    return allProperties
      .filter((property) => {
        const matchesSearch =
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = listingType === "all" || property.type === listingType;
        const matchesPropertyType = propertyType === "all" || property.property_type === propertyType;
        const matchesPrice =
          property.type === "rent"
            ? property.price <= priceRange[1] / 100
            : property.price >= priceRange[0] && property.price <= priceRange[1];
        return matchesSearch && matchesType && matchesPropertyType && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [allProperties, searchQuery, listingType, propertyType, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setListingType("all");
    setPriceRange([0, 600000]);
    setPropertyType("all");
  };

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
            <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
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
                    {(["all", "sale", "rent"] as const).map((type) => (
                      <Button
                        key={type}
                        variant={listingType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setListingType(type)}
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
                  <Select value={propertyType} onValueChange={(v) => setPropertyType(v as typeof propertyType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
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
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...toPropertyCardProps(property)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-background rounded-xl">
                  <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                  <Button variant="link" onClick={clearFilters}>
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