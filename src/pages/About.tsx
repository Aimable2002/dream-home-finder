import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Globe, 
  Shield, 
  Users, 
  Target, 
  Eye,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const stats = [
  { value: "500+", label: "Properties Sold" },
  { value: "15+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "50+", label: "Team Members" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920')] bg-cover bg-center opacity-10" />
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                About CKIM Homes & Estates
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed">
                Rwanda's premier real estate partner, dedicated to helping local and diaspora 
                clients find their perfect property. We combine deep market expertise with 
                exceptional service to make your property dreams a reality.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-secondary">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-secondary-foreground/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">Who We Are</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                  Your Trusted Real Estate Partner in Rwanda
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  CKIM Homes & Estates was founded with a simple mission: to provide exceptional 
                  real estate services that bridge the gap between Rwanda's vibrant property market 
                  and clients worldwide.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We understand the unique challenges faced by diaspora clients looking to invest 
                  in their homeland. That's why we've built a team of dedicated professionals who 
                  provide transparent, reliable, and personalized service every step of the way.
                </p>
                <div className="space-y-3">
                  {[
                    "Verified and inspected properties",
                    "Transparent pricing with no hidden fees",
                    "Dedicated support for diaspora clients",
                    "Legal and documentation assistance",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                  alt="Luxury property in Rwanda"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-xl shadow-lg hidden md:block">
                  <p className="font-heading text-3xl font-bold text-secondary-foreground">15+</p>
                  <p className="text-secondary-foreground/80 text-sm">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-8 md:p-10 rounded-2xl shadow-sm">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-6">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide exceptional real estate services that empower individuals and 
                  families to find their perfect home in Rwanda. We strive to make property 
                  ownership accessible, transparent, and rewarding for all our clients, 
                  whether they're local residents or members of the diaspora community.
                </p>
              </div>
              <div className="bg-background p-8 md:p-10 rounded-2xl shadow-sm">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-xl mb-6">
                  <Eye className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and recognized real estate brand in Rwanda, known 
                  for our integrity, expertise, and commitment to client satisfaction. We 
                  envision a future where every Rwandan, at home or abroad, can easily and 
                  confidently invest in quality properties in their homeland.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Rwanda */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Invest in Rwanda</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Why Rwanda is the Perfect Investment
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Rwanda has emerged as one of Africa's most attractive real estate markets, 
                offering stability, growth, and exceptional quality of life.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Political Stability",
                  description: "One of Africa's safest and most stable countries with strong governance.",
                },
                {
                  icon: Building2,
                  title: "Growing Economy",
                  description: "Consistent economic growth with a thriving real estate sector.",
                },
                {
                  icon: Users,
                  title: "Diaspora-Friendly",
                  description: "Welcoming policies for diaspora investments and property ownership.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-muted/50 p-6 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container-custom text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Let our team of experts guide you through every step of your property journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Browse Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
