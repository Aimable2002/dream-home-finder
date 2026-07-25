import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Upload, X, ImagePlus, Save, Loader2, Star } from "lucide-react";
import {
  getProperty,
  updateProperty,
  deletePropertyImage,
  uploadPropertyImage,
  setCoverImage,
  type PropertyImage,
  type PropertyType,
} from "@/lib/api";
import { getImageOrientation } from "@/lib/images";
import type { Orientation } from "@/lib/api";

interface PendingImage {
  file: File;
  previewUrl: string;
  orientation: Orientation;
}

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [newImages, setNewImages] = useState<PendingImage[]>([]);
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

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const property = await getProperty(id);
        if (!property) {
          toast({ title: "Property not found", variant: "destructive" });
          navigate("/admin/properties");
          return;
        }
        setFormData({
          title: property.title,
          price: String(property.price),
          location: property.location,
          description: property.description ?? "",
          type: property.type,
          propertyType: property.property_type,
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          parking: String(property.parking),
          size: property.size ? String(property.size) : "",
          isBestDeal: property.is_best_deal,
        });
        setExistingImages(
          [...property.property_images].sort((a, b) => a.sort_order - b.sort_order)
        );
      } catch (error) {
        toast({
          title: "Couldn't load property",
          description: error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const totalImageCount = existingImages.length + newImages.length;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - totalImageCount;
    const toAdd = Array.from(files).slice(0, remaining);

    const withOrientation = await Promise.all(
      toAdd.map(async (file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        orientation: await getImageOrientation(file),
      }))
    );
    setNewImages((prev) => [...prev, ...withOrientation]);
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeExistingImage = async (image: PropertyImage) => {
    try {
      await deletePropertyImage(image);
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
      toast({ title: "Image removed" });
    } catch (error) {
      toast({
        title: "Couldn't remove image",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleSetCover = async (image: PropertyImage) => {
    if (!id) return;
    try {
      await setCoverImage(id, image.id);
      setExistingImages((prev) => prev.map((img) => ({ ...img, is_cover: img.id === image.id })));
      toast({ title: "Cover image updated" });
    } catch (error) {
      toast({
        title: "Couldn't update cover image",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (totalImageCount === 0) {
      toast({ title: "Add at least one image", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProperty(id, {
        title: formData.title,
        price: Number(formData.price),
        location: formData.location,
        address: null,
        description: formData.description || null,
        type: formData.type as "sale" | "rent",
        property_type: formData.propertyType as PropertyType,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        parking: Number(formData.parking) || 0,
        size: formData.size ? Number(formData.size) : null,
        is_best_deal: formData.isBestDeal,
        is_featured: false,
      });

      const hasCover = existingImages.some((img) => img.is_cover);
      for (let i = 0; i < newImages.length; i++) {
        await uploadPropertyImage(id, newImages[i].file, newImages[i].orientation, {
          isCover: !hasCover && i === 0,
          sortOrder: existingImages.length + i,
        });
      }

      toast({ title: "Property Updated", description: "Your changes have been saved." });
      navigate("/admin/properties");
    } catch (error) {
      toast({
        title: "Couldn't update property",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground mt-1">Update the details for this listing.</p>
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
                {existingImages.map((image) => (
                  <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white capitalize">
                      {image.orientation}
                    </span>
                    {image.is_cover ? (
                      <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetCover(image)}
                        className="absolute top-1 left-1 p-1 bg-black/60 rounded-full hover:bg-black/80"
                        title="Set as cover"
                      >
                        <Star className="h-3.5 w-3.5 text-white" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {newImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={image.previewUrl} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white capitalize">
                      {image.orientation}
                    </span>
                    <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {totalImageCount < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Up to 10 images. Click the star on any image to make it the cover.
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Listing Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parking">Parking Spaces</Label>
                  <Input
                    id="parking"
                    type="number"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (sqft)</Label>
                  <Input
                    id="size"
                    type="number"
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
                    Featured in Best Deals, and its landscape images become eligible for the hero slideshow.
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin/properties")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProperty;