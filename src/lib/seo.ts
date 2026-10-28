export const publicPageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "ImenaHomes | Houses for Sale & Rent in Rwanda",
    description: "Explore houses for sale and rent in Rwanda with ImenaHomes. Compare properties, browse photo galleries and best deals, and contact our team from Rwanda or abroad.",
  },
  "/properties": {
    title: "Properties for Sale & Rent in Rwanda | ImenaHomes",
    description: "Find your next house, apartment, villa or investment property in Rwanda. Search ImenaHomes listings by location, price and property type.",
  },
  "/best-deals": {
    title: "Best Property Deals in Rwanda | ImenaHomes",
    description: "Browse highlighted houses and apartments for sale and rent in Rwanda. Explore ImenaHomes property deals, photos, prices and locations.",
  },
  "/team": {
    title: "Meet Our Real Estate Team | ImenaHomes Rwanda",
    description: "Meet the ImenaHomes team serving home buyers, renters and diaspora clients with real estate support in Rwanda.",
  },
  "/about": {
    title: "About ImenaHomes | Rwanda & Diaspora Real Estate",
    description: "Learn about ImenaHomes, our mission and our approach to helping Rwanda and diaspora clients buy, rent and invest in property.",
  },
  "/contact": {
    title: "Contact ImenaHomes | Real Estate in Rwanda",
    description: "Contact ImenaHomes about buying, renting or listing a property in Rwanda. Reach our team by phone, WhatsApp, email or contact form.",
  },
};

export function getPageMetadata(pathname: string) {
  const page = publicPageMetadata[pathname];
  if (page) return { ...page, noindex: false };
  if (pathname.startsWith("/property/")) {
    return { title: "Property Details | ImenaHomes Rwanda", description: "Explore this Rwanda property with ImenaHomes: photos, price, location, features and contact details.", noindex: false };
  }
  return { title: pathname.startsWith("/admin") ? "Admin | ImenaHomes" : "Page Not Found | ImenaHomes", description: "ImenaHomes real estate in Rwanda.", noindex: true };
}