import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { BestDealsCarousel } from "@/components/home/BestDealsCarousel";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <BestDealsCarousel />
        <FeaturedProperties />
        <WhyChooseUs />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
