import { useState } from "react";
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
  Share2,
  Heart
} from "lucide-react";

// Mock data for a single property
const propertyData = {
  id: "1",
  title: "Modern Villa in Kigali Heights",
  price: 450000,
  location: "Kigali Heights, Kigali",
  address: "KG 123 Street, Kigali Heights, Nyarugenge District, Kigali",
  images: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
  ],
  bedrooms: 4,
  bathrooms: 3,
  size: 3200,
  parking: 2,
  type: "sale" as "sale" | "rent",
  isBestDeal: true,
  description: `This stunning modern villa is located in the prestigious Kigali Heights neighborhood, offering breathtaking views of the city and surrounding hills. The property features contemporary architecture with clean lines and floor-to-ceiling windows that flood the interior with natural light.

The open-plan living area seamlessly connects the living room, dining area, and gourmet kitchen, creating an ideal space for entertaining. High-end finishes include imported marble flooring, custom cabinetry, and premium appliances.

The master suite occupies the entire upper floor, featuring a private balcony, walk-in closet, and spa-like bathroom with a soaking tub and rainfall shower. Three additional bedrooms each have en-suite bathrooms and generous closet space.

Outdoor amenities include a landscaped garden, covered terrace, and a two-car garage. The property is located within a secure gated community with 24/7 security.`,
  features: [
    "Swimming Pool",
    "Garden",
    "Security System",
    "Air Conditioning",
    "Backup Generator",
    "Water Tank",
    "Modern Kitchen",
    "Walk-in Closets",
  ],
  agent: {
    name: "Jean Pierre Habimana",
    phone: "+250 780 000 000",
    whatsapp: "+250780000000",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
  },
};

const similarProperties = [
  {
    id: "2",
    title: "Luxury Apartment Nyarutarama",
    price: 380000,
    location: "Nyarutarama, Kigali",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    size: 1800,
    type: "sale" as const,
    isBestDeal: false,
  },
  {
    id: "3",
    title: "Elegant Family Home",
    price: 320000,
    location: "Kimihurura, Kigali",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    bedrooms: 5,
    bathrooms: 4,
    parking: 2,
    size: 4500,
    type: "sale" as const,
    isBestDeal: true,
  },
  {
    id: "4",
    title: "Hillside Contemporary Home",
    price: 520000,
    location: "Rebero, Kigali",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 3800,
    type: "sale" as const,
    isBestDeal: false,
  },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const property = propertyData; // In real app, fetch by id

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
                <div className="aspect-[16/10] relative">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
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

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.isBestDeal && <DealBadge />}
                    <Badge className={property.type === "sale" ? "bg-primary" : "bg-blue-600"}>
                      For {property.type === "sale" ? "Sale" : "Rent"}
                    </Badge>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? "border-secondary" : "border-transparent"
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
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
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                  {formatPrice(property.price)}
                  {property.type === "rent" && <span className="text-lg font-normal text-muted-foreground">/month</span>}
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
                      <p className="font-semibold">{property.size.toLocaleString()} sqft</p>
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
                <div className="mb-8">
                  <h2 className="font-heading text-xl font-semibold mb-4">Description</h2>
                  <div className="prose prose-gray max-w-none">
                    {property.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="h-2 w-2 bg-secondary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Agent Contact */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-xl p-6 shadow-sm sticky top-24 border border-border">
                <h3 className="font-heading font-semibold text-lg mb-4">Contact Agent</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{property.agent.name}</p>
                    <p className="text-sm text-muted-foreground">Property Agent</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={`tel:${property.agent.phone}`}
                    className="w-full"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Agent
                    </Button>
                  </a>
                  <a 
                    href={`https://wa.me/${property.agent.whatsapp}?text=Hi, I'm interested in ${property.title}`}
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
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-8">Similar Properties</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
