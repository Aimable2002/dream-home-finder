import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, ImagePlus, Save } from "lucide-react";

const AddProperty = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    type: "sale",
    propertyType: "house",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    size: "",
    isBestDeal: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, upload to Lovable Cloud storage
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Property Added!",
      description: "Your property has been successfully listed.",
    });
    
    // Reset form
    setFormData({
      title: "",
      price: "",
      location: "",
      description: "",
      type: "sale",
      propertyType: "house",
      bedrooms: "",
      bathrooms: "",
      parking: "",
      size: "",
      isBestDeal: false,
    });
    setImages([]);
    setIsSubmitting(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to list a new property.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload up to 10 images. First image will be the cover.
              </p>
            </CardContent>
          </Card>

          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="Modern Villa in Kigali Heights"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="450000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Kigali Heights, Kigali"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Listing Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Type *</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="4"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="3"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parking">Parking Spaces</Label>
                  <Input
                    id="parking"
                    type="number"
                    placeholder="2"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (sqft)</Label>
                  <Input
                    id="size"
                    type="number"
                    placeholder="3200"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Deal Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bestDeal" className="text-base font-medium">Mark as Best Deal</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    This property will be featured in the Best Deals section with a gold badge.
                  </p>
                </div>
                <Switch
                  id="bestDeal"
                  checked={formData.isBestDeal}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBestDeal: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button 
              type="submit" 
              size="lg" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isSubmitting}
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? "Saving..." : "Save Property"}
            </Button>
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProperty;
