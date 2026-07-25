import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { Shield, Heart, Users, Award, Loader2 } from "lucide-react";
import { getTeamMembers, type TeamMember } from "@/lib/api";

const values = [
  {
    icon: Shield,
    title: "Professional",
    description: "Licensed agents with deep market knowledge and ethical standards.",
  },
  {
    icon: Heart,
    title: "Client-Focused",
    description: "Your satisfaction is our priority. We listen, understand, and deliver.",
  },
  {
    icon: Users,
    title: "Trusted",
    description: "Building lasting relationships through transparency and integrity.",
  },
  {
    icon: Award,
    title: "Expert",
    description: "Specialists in Rwanda & diaspora real estate investments.",
  },
];

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTeamMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setIsLoading(false));
  }, []);

  const featuredMember = members.find((m) => m.featured);
  const otherMembers = members.filter((m) => !m.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container-custom text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Meet Our Team
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
              The dedicated professionals behind CKIM Homes & Estates.
              We're here to help you find your perfect property in Rwanda.
            </p>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          <>
            {/* Featured Leader */}
            {featuredMember && (
              <section className="py-12 md:py-20 bg-muted/30">
                <div className="container-custom">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-background rounded-2xl overflow-hidden shadow-lg">
                      <div className="grid md:grid-cols-2">
                        <div className="aspect-square md:aspect-auto bg-muted">
                          <img
                            src={featuredMember.image_url || "/placeholder.svg"}
                            alt={featuredMember.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                            <Award className="h-4 w-4" />
                            Leadership
                          </div>
                          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                            {featuredMember.name}
                          </h2>
                          <p className="text-secondary font-medium mb-4">{featuredMember.position}</p>
                          {featuredMember.bio && (
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              {featuredMember.bio}
                            </p>
                          )}
                          <div className="flex gap-3">
                            {featuredMember.phone && (
                              <a
                                href={`tel:${featuredMember.phone}`}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                              >
                                Call
                              </a>
                            )}
                            {featuredMember.whatsapp && (
                              <a
                                href={`https://wa.me/${featuredMember.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                WhatsApp
                              </a>
                            )}
                            {featuredMember.email && (
                              <a
                                href={`mailto:${featuredMember.email}`}
                                className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                              >
                                Email
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Team Grid */}
            <section className="py-12 md:py-20">
              <div className="container-custom">
                <div className="text-center mb-12">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Our Team</h2>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Each member brings unique expertise to help you navigate the Rwanda property market.
                  </p>
                </div>

                {otherMembers.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {otherMembers.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        name={member.name}
                        position={member.position}
                        bio={member.bio}
                        image={member.image_url}
                        phone={member.phone}
                        email={member.email}
                        whatsapp={member.whatsapp}
                      />
                    ))}
                  </div>
                ) : (
                  !featuredMember && (
                    <p className="text-muted-foreground text-center">
                      Team profiles are coming soon.
                    </p>
                  )
                )}
              </div>
            </section>
          </>
        )}

        {/* Values Section */}
        <section className="py-12 md:py-20 bg-primary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Our Values
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto">
                The principles that guide everything we do at CKIM Homes & Estates.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-xl mb-4">
                    <value.icon className="h-7 w-7 text-secondary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-primary-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Team;