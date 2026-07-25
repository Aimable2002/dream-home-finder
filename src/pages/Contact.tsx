import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Send,
} from "lucide-react";
import { createInquiry, getSettings, type SiteSettings } from "@/lib/api";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
      });
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Couldn't send your message",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = settings?.phone || "+250780000000";
  const whatsapp = settings?.whatsapp || "250780000000";
  const email = settings?.email || "info@ckimhomes.rw";
  const address = settings?.address || "KG 123 Street, Nyarugenge District, Kigali, Rwanda";

  const socialLinks = [
    { icon: Facebook, href: settings?.facebook, label: "Facebook" },
    { icon: Instagram, href: settings?.instagram, label: "Instagram" },
    { icon: Twitter, href: settings?.twitter, label: "Twitter" },
    { icon: Linkedin, href: settings?.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container-custom text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
              Have questions about a property or need assistance?
              We're here to help you every step of the way.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-background rounded-2xl p-8 md:p-10 shadow-sm border border-border">
                <h2 className="font-heading text-2xl font-bold mb-2">Send us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 780 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about what you're looking for..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <h3 className="font-heading text-xl font-bold mb-6">Quick Contact</h3>
                  <div className="space-y-4">
                    <a
                      href={`https://wa.me/${whatsapp}?text=Hi, I'm interested in your properties`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-xl hover:bg-primary-foreground/20 transition-colors"
                    >
                      <div className="p-3 bg-emerald-600 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-primary-foreground/80 text-sm">Chat with us instantly</p>
                      </div>
                    </a>
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-xl hover:bg-primary-foreground/20 transition-colors"
                    >
                      <div className="p-3 bg-secondary rounded-lg">
                        <Phone className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{phone}</p>
                        <p className="text-primary-foreground/80 text-sm">Call us directly</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-muted/50 rounded-2xl p-8">
                  <h3 className="font-heading text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Office Address</p>
                        <p className="text-muted-foreground text-sm">{address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Email</p>
                        <a href={`mailto:${email}`} className="text-muted-foreground text-sm hover:text-secondary transition-colors">
                          {email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Business Hours</p>
                        <p className="text-muted-foreground text-sm">
                          Monday - Friday: 8:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 3:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="bg-muted/50 rounded-2xl p-8">
                    <h3 className="font-heading text-xl font-bold mb-4">Follow Us</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Stay updated with our latest properties and news.
                    </p>
                    <div className="flex gap-4">
                      {socialLinks.map(({ icon: Icon, href, label }) => (
                        <a
                          key={label}
                          href={href!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          aria-label={label}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-12">
              <div className="bg-muted rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Map Integration</p>
                  <p className="text-sm text-muted-foreground">{settings?.address || "Kigali, Rwanda"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;