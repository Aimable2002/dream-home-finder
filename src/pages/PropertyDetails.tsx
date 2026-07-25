import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { DealBadge } from "@/components/property/DealBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Bath,
  Maximize,
  Car,
  Phone,
  MessageCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getProperty, getProperties, getSettings, incrementPropertyViews, type PropertyWithImages, type SiteSettings } from "@/lib/api";
import { toPropertyCardProps, formatPrice } from "@/lib/property-utils";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyWithImages | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertyWithImages[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setCurrentImageIndex(0);
    (async () => {
      try {
        const [prop, settingsData] = await Promise.all([getProperty(id), getSettings()]);
        setProperty(prop);
        setSettings(settingsData);
        if (prop) {
          incrementPropertyViews(prop.id);
          const similar = await getProperties({ type: prop.type, limit: 4 });
          setSimilarProperties(similar.filter((p) => p.id !== prop.id).slice(0, 3));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <p className="text-xl font-semibold mb-2">Property not found</p>
          <p className="text-muted-foreground mb-6">It may have been sold or removed.</p>
          <Link to="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = [...property.property_images].sort((a, b) => a.sort_order - b.sort_order);
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const whatsapp = settings?.whatsapp || "250780000000";
  const phone = settings?.phone || "+250780000000";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-foreground transition-colors">Properties</Link>
              <span>/</span>
              <span className="text-foreground">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-xl overflow-hidden">
                <div
                  className={`aspect-[16/10] relative flex items-center justify-center ${
                    currentImage?.orientation === "portrait" ? "bg-black" : ""
                  }`}
                >
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={`${property.title} - Image ${currentImageIndex + 1}`}
                      // Landscape images fill the frame; portrait images are shown
                      // in full (object-contain) instead of being cropped down to
                      // a wide aspect ratio.
                      className={
                        currentImage.orientation === "portrait"
                          ? "max-w-full max-h-full object-contain"
                          : "w-full h-full object-cover"
                      }
                    />
                  ) : (
                    <img src="/placeholder.svg" alt={property.title} className="w-full h-full object-cover" />
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 p-2 rounded-full shadow-lg hover:bg-background transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 p-2 rounded-full shadow-lg hover:bg-background transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.is_best_deal && <DealBadge />}
                    <Badge className={property.type === "sale" ? "bg-primary" : "bg-blue-600"}>
                      For {property.type === "sale" ? "Sale" : "Rent"}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? "border-secondary" : "border-transparent"
                        }`}
                      >
                        <img src={image.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-secondary" />
                      <span>{property.address || property.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                  {formatPrice(property.price, property.type)}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <Bed className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <Bath className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <Maximize className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-semibold">
                        {property.size ? `${property.size.toLocaleString()} sqft` : "\u2014"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <Car className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Parking</p>
                      <p className="font-semibold">{property.parking} Cars</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mb-8">
                    <h2 className="font-heading text-xl font-semibold mb-4">Description</h2>
                    <div className="prose prose-gray max-w-none">
                      {property.description.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Contact */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-xl p-6 shadow-sm sticky top-24 border border-border">
                <h3 className="font-heading font-semibold text-lg mb-4">Interested in this property?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Reach out to {settings?.company_name || "our team"} and we'll help you take the next step.
                </p>

                <div className="space-y-3">
                  <a href={`tel:${phone}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Us
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}?text=Hi, I'm interested in ${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-primary-foreground" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Available Mon-Fri, 8AM - 6PM
                </p>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <section className="mt-16">
              <h2 className="font-heading text-2xl font-bold mb-8">Similar Properties</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.map((p) => (
                  <PropertyCard key={p.id} {...toPropertyCardProps(p)} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;