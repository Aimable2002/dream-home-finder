import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getHeroImages, getSettings } from "@/lib/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop";
const SLIDE_INTERVAL_MS = 6000;

/**
 * Fisher-Yates shuffle. Used to build a random viewing order for the hero
 * images rather than picking a fresh random index every tick, which avoids
 * showing the same image twice in a row and guarantees every image is seen
 * once before any repeats.
 */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Stats {
  properties: string;
  clients: string;
  years: string;
}

export function HeroSection() {
  const [slides, setSlides] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const orderRef = useRef<string[]>([]);
  const [stats, setStats] = useState<Stats>({ properties: "500+", clients: "1,200+", years: "15+" });

  useEffect(() => {
    (async () => {
      try {
        const [heroImages, settings] = await Promise.all([getHeroImages(), getSettings()]);
        const urls = heroImages.map((img) => img.url);
        orderRef.current = urls.length > 0 ? shuffle(urls) : [];
        setSlides(orderRef.current.length > 0 ? orderRef.current : [FALLBACK_IMAGE]);
        setStats({
          properties: settings.stats_properties_listed ?? "500+",
          clients: settings.stats_happy_clients ?? "1,200+",
          years: settings.stats_years_experience ?? "15+",
        });
      } catch {
        // Supabase not configured yet, or the query failed — fall back quietly.
        setSlides([FALLBACK_IMAGE]);
      }
    })();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => {
        const next = prev + 1;
        // Full pass complete — reshuffle for the next cycle so the order
        // isn't identical every time, while still never repeating back-to-back.
        if (next >= slides.length) {
          orderRef.current = shuffle(slides);
          setSlides(orderRef.current);
          return 0;
        }
        return next;
      });
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides]);

  const backgroundImage = slides[slideIndex] ?? FALLBACK_IMAGE;

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        key={backgroundImage}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Premier Real Estate in Rwanda
          </span>

          <h1 className="heading-1 text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-secondary">Home in Rwanda</span>
          </h1>

          <p className="body-large text-white/90 mb-8 max-w-xl">
            Buy, rent, or invest with confidence through CKIM Homes & Estates.
            Your trusted partner serving Rwanda and the global diaspora community.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium text-base"
            >
              <Link to="/properties">
                View Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-primary hover:bg-white hover:text-primary font-medium text-base"
            >
              <Link to="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <span className="block text-3xl font-heading font-bold text-secondary">{stats.properties}</span>
              <span className="text-white/80 text-sm">Properties Listed</span>
            </div>
            <div>
              <span className="block text-3xl font-heading font-bold text-secondary">{stats.clients}</span>
              <span className="text-white/80 text-sm">Happy Clients</span>
            </div>
            <div>
              <span className="block text-3xl font-heading font-bold text-secondary">{stats.years}</span>
              <span className="text-white/80 text-sm">Years Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex gap-2">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === slideIndex ? "w-6 bg-secondary" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}