import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { getSettings, type SiteSettings } from "@/lib/api";

const quickLinks = [
  { name: "Properties", path: "/properties" },
  { name: "Best Deals", path: "/best-deals" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const propertyTypes = [
  { name: "Houses for Sale", path: "/properties?type=sale" },
  { name: "Houses for Rent", path: "/properties?type=rent" },
  { name: "Apartments", path: "/properties?category=apartment" },
  { name: "Land & Plots", path: "/properties?category=land" },
];

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const companyName = settings?.company_name || "CKIM Homes & Estates";
  const phone = settings?.phone || "+250780000000";
  const email = settings?.email || "info@ckimhomes.rw";
  const address = settings?.address || "Kigali, Rwanda";

  const socialLinks = [
    { icon: Facebook, href: settings?.facebook, label: "Facebook" },
    { icon: Instagram, href: settings?.instagram, label: "Instagram" },
    { icon: Twitter, href: settings?.twitter, label: "Twitter" },
    { icon: Linkedin, href: settings?.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt={companyName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-secondary-foreground font-heading font-bold text-lg">CK</span>
                )}
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white">CKIM</span>
                <span className="font-heading text-sm block text-primary-foreground/80 -mt-1">Homes & Estates</span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Your trusted partner for premium real estate in Rwanda. Serving local and diaspora clients worldwide.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-secondary">Properties</h4>
            <ul className="space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-secondary">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">{address}</span>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-secondary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}