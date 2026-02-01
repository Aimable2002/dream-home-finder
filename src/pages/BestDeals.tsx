import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Sparkles } from "lucide-react";

const bestDeals = [
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
    title: "Lakefront Luxury Villa",
    price: 680000,
    location: "Lake Kivu, Rubavu",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    bedrooms: 6,
    bathrooms: 5,
    parking: 3,
    size: 5200,
    type: "sale" as const,
    isBestDeal: true,
  },
  {
    id: "5",
    title: "Executive Apartment",
    price: 2800,
    location: "Nyarutarama, Kigali",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    size: 1400,
    type: "rent" as const,
    isBestDeal: true,
  },
  {
    id: "6",
    title: "Mountain View Estate",
    price: 520000,
    location: "Rebero, Kigali",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 3800,
    type: "sale" as const,
    isBestDeal: true,
  },
];

const BestDeals = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920')] bg-cover bg-center opacity-10" />
          <div className="container-custom relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Exclusive Offers</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Best Deals
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
              Discover our hand-picked selection of exceptional properties at unbeatable prices. 
              Limited time offers you won't want to miss.
            </p>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                  Hot Properties
                </h2>
                <p className="text-muted-foreground">
                  {bestDeals.length} exclusive deals available
                </p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-lg">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">All properties verified</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {bestDeals.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary">
          <div className="container-custom text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
              Don't See What You're Looking For?
            </h2>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
              Contact us and we'll help you find the perfect property that matches your needs and budget.
            </p>
            <a
              href="https://wa.me/250780000000?text=Hi, I'm looking for a property deal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us on WhatsApp
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BestDeals;
