import { Shield, Users, Globe, Award, Clock, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Properties",
    description: "Every property is thoroughly inspected and verified before listing to ensure quality and authenticity.",
  },
  {
    icon: Users,
    title: "Trusted Agents",
    description: "Our professional team of licensed agents provides expert guidance throughout your real estate journey.",
  },
  {
    icon: Globe,
    title: "Diaspora Support",
    description: "Specialized services for diaspora clients worldwide with virtual tours and secure transaction handling.",
  },
  {
    icon: Award,
    title: "Premium Selection",
    description: "Access to exclusive luxury properties and prime real estate opportunities across Rwanda.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock support to accommodate different time zones and urgent property needs.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Service",
    description: "Tailored solutions to match your unique requirements, budget, and investment goals.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-primary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Why CKIM Homes
          </span>
          <h2 className="heading-2 text-primary-foreground mt-2">
            Why Choose Us
          </h2>
          <p className="text-primary-foreground/80 mt-4">
            We're committed to making your real estate experience seamless, secure, and successful.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:border-secondary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
                <feature.icon className="h-6 w-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-primary-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
