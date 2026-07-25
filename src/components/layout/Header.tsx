import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, type SiteSettings } from "@/lib/api";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "Best Deals", path: "/best-deals" },
  { name: "Team", path: "/team" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const companyName = settings?.company_name || "CKIM Homes & Estates";
  const phone = settings?.phone || "+250780000000";
  // Split "CKIM Homes & Estates" into a bold first word + smaller subtitle,
  // matching the two-line logo lockup. Falls back gracefully for any name.
  const [nameFirstWord, ...nameRest] = companyName.split(" ");
  const nameSubtitle = nameRest.join(" ");
  const logoInitials = companyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container-custom">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center overflow-hidden flex-shrink-0">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={companyName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-foreground font-heading font-bold text-lg">{logoInitials}</span>
              )}
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg text-primary">{nameFirstWord}</span>
              {nameSubtitle && (
                <span className="font-heading text-sm block text-muted-foreground -mt-1">{nameSubtitle}</span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  location.pathname === link.path
                    ? "text-secondary"
                    : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
            <Link to="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium">
                List Property
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors hover:text-secondary ${
                    location.pathname === link.path
                      ? "text-secondary"
                      : "text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium w-full mt-2">
                  List Property
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}