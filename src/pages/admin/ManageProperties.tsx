import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Edit, Trash2, Eye, Star, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockProperties = [
  {
    id: "1",
    title: "Modern Villa in Kigali Heights",
    price: 450000,
    location: "Kigali Heights, Kigali",
    type: "sale",
    isBestDeal: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Luxury Apartment Nyarutarama",
    price: 1500,
    location: "Nyarutarama, Kigali",
    type: "rent",
    isBestDeal: false,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    title: "Elegant Family Home",
    price: 320000,
    location: "Kimihurura, Kigali",
    type: "sale",
    isBestDeal: true,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Premium Penthouse Suite",
    price: 3500,
    location: "Kigali City Center",
    type: "rent",
    isBestDeal: true,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200",
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    title: "Hillside Contemporary Home",
    price: 520000,
    location: "Rebero, Kigali",
    type: "sale",
    isBestDeal: false,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200",
    createdAt: "2024-01-05",
  },
];

const ManageProperties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState(mockProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || property.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: "Property Deleted",
      description: "The property has been removed from your listings.",
    });
  };

  const toggleBestDeal = (id: string) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, isBestDeal: !p.isBestDeal } : p
    ));
    toast({
      title: "Status Updated",
      description: "Best deal status has been updated.",
    });
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
    return type === "rent" ? `${formatted}/mo` : formatted;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Manage Properties</h1>
            <p className="text-muted-foreground mt-1">View, edit, and manage all your property listings.</p>
          </div>
          <a href="/admin/add-property">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Add New Property
            </Button>
          </a>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Properties ({filteredProperties.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full sm:w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={property.type === "sale" ? "bg-primary" : "bg-blue-600"}>
                            {property.type === "sale" ? "For Sale" : "For Rent"}
                          </Badge>
                          {property.isBestDeal && (
                            <Badge className="bg-secondary text-secondary-foreground">
                              Best Deal
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-lg font-bold text-secondary mt-2">
                        {formatPrice(property.price, property.type)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added on {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex sm:flex-col gap-2 justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/property/${property.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleBestDeal(property.id)}
                        className={property.isBestDeal ? "text-secondary border-secondary" : ""}
                      >
                        <Star className={`h-4 w-4 ${property.isBestDeal ? "fill-secondary" : ""}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the property listing.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(property.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No properties found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageProperties;
