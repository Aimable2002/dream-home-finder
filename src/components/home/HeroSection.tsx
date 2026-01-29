import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')`,
        }}
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
              className="border-white text-white hover:bg-white hover:text-primary font-medium text-base"
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
              <span className="block text-3xl font-heading font-bold text-secondary">500+</span>
              <span className="text-white/80 text-sm">Properties Listed</span>
            </div>
            <div>
              <span className="block text-3xl font-heading font-bold text-secondary">1,200+</span>
              <span className="text-white/80 text-sm">Happy Clients</span>
            </div>
            <div>
              <span className="block text-3xl font-heading font-bold text-secondary">15+</span>
              <span className="text-white/80 text-sm">Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
