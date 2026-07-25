import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DealBadge } from "@/components/property/DealBadge";
import { getProperties, type PropertyWithImages } from "@/lib/api";
import { coverImageUrl, formatPrice } from "@/lib/property-utils";

export function BestDealsCarousel() {
  const [deals, setDeals] = useState<PropertyWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getProperties({ isBestDeal: true, limit: 6 })
      .then(setDeals)
      .catch(() => setDeals([]))
      .finally(() => setIsLoading(false));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (deals.length ? (prev + 1) % deals.length : 0));
  }, [deals.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (deals.length ? (prev - 1 + deals.length) % deals.length : 0));
  }, [deals.length]);

  useEffect(() => {
    if (isPaused || deals.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, deals.length]);

  if (!isLoading && deals.length === 0) {
    return null;
  }

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

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          /* Carousel */
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
                {deals.map((deal) => (
                  <div key={deal.id} className="min-w-full">
                    <Link to={`/property/${deal.id}`} className="block">
                      <div className="relative aspect-[21/9] md:aspect-[3/1]">
                        <img
                          src={coverImageUrl(deal)}
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

            {deals.length > 1 && (
              <>
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
                  {deals.map((_, index) => (
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
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}