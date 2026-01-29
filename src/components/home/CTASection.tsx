import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";

export function CTASection() {
  const whatsappNumber = "+250780000000";
  const whatsappMessage = encodeURIComponent("Hello! I'm interested in learning more about your properties.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-green-dark p-8 md:p-12 lg:p-16">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="heading-2 text-primary-foreground mb-4">
                Looking for the Right Property?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl">
                Let our expert team help you find your dream home. Contact us today for personalized assistance and exclusive property listings.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium text-base min-w-[200px]"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-medium text-base min-w-[200px]"
              >
                <a href="tel:+250780000000">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
