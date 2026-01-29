import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DealBadge } from "@/components/property/DealBadge";

interface Deal {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  type: "rent" | "sale";
}

// Mock data - will be replaced with real data from the backend
const mockDeals: Deal[] = [
  {
    id: "1",
    title: "Luxury Villa with Pool in Nyarutarama",
    price: 450000,
    location: "Nyarutarama, Kigali",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    type: "sale",
  },
  {
    id: "2",
    title: "Modern Apartment in Kacyiru",
    price: 1500,
    location: "Kacyiru, Kigali",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    type: "rent",
  },
  {
    id: "3",
    title: "Executive Home in Kibagabaga",
    price: 320000,
    location: "Kibagabaga, Kigali",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    type: "sale",
  },
  {
    id: "4",
    title: "Spacious Family House in Kimironko",
    price: 2200,
    location: "Kimironko, Kigali",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    type: "rent",
  },
];

export function BestDealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % mockDeals.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + mockDeals.length) % mockDeals.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const formatPrice = (price: number, type: "rent" | "sale") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
    return type === "rent" ? `${formatted}/mo` : formatted;
  };

  return (
    <section className="py-16 bg-muted">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <DealBadge variant="large" text="BEST DEALS" />
            <h2 className="heading-2 text-foreground mt-4">
              Exclusive Property Offers
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Don't miss out on these incredible opportunities. Hand-picked properties at unbeatable prices.
            </p>
          </div>
          <Link to="/best-deals">
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
              View All Deals
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {mockDeals.map((deal) => (
                <div key={deal.id} className="min-w-full">
                  <Link to={`/property/${deal.id}`} className="block">
                    <div className="relative aspect-[21/9] md:aspect-[3/1]">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex items-center">
                        <div className="container-custom">
                          <div className="max-w-xl">
                            <DealBadge text="HOT OFFER" />
                            <h3 className="font-heading font-bold text-2xl md:text-4xl text-white mt-4 mb-3">
                              {deal.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/80 mb-4">
                              <MapPin className="h-5 w-5 text-secondary" />
                              <span>{deal.location}</span>
                            </div>
                            <div className="text-3xl md:text-4xl font-heading font-bold text-secondary">
                              {formatPrice(deal.price, deal.type)}
                            </div>
                            <Button
                              className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mockDeals.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-secondary w-6"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
