import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Sparkles, Loader2 } from "lucide-react";
import { getProperties, getSettings, type PropertyWithImages } from "@/lib/api";
import { toPropertyCardProps } from "@/lib/property-utils";

const BestDeals = () => {
  const [deals, setDeals] = useState<PropertyWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsapp, setWhatsapp] = useState("250780000000");

  useEffect(() => {
    Promise.all([getProperties({ isBestDeal: true }), getSettings()])
      .then(([deals, settings]) => {
        setDeals(deals);
        if (settings.whatsapp) setWhatsapp(settings.whatsapp);
      })
      .catch(() => setDeals([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-16 md:py-24 relative overflow-hidden">
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
                  {deals.length} exclusive deals available
                </p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-lg">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">All properties verified</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : deals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {deals.map((property) => (
                  <PropertyCard key={property.id} {...toPropertyCardProps(property)} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-16">
                No best deals right now. Check back soon.
              </p>
            )}
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
              href={`https://wa.me/${whatsapp}?text=Hi, I'm looking for a property deal`}
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