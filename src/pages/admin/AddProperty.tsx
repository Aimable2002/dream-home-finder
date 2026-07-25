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
import { Upload, X, ImagePlus, Save, Building2, Users } from "lucide-react";
import { createProperty, createTeamMember, uploadPropertyImage, uploadTeamAvatar } from "@/lib/api";
import { getImageOrientation } from "@/lib/images";
import type { Orientation, PropertyType } from "@/lib/api";

type Category = "property" | "team";

interface PendingImage {
  file: File;
  previewUrl: string;
  orientation: Orientation;
}

const AddProperty = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState<Category>("property");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Property state -----------------------------------------------------
  const [images, setImages] = useState<PendingImage[]>([]);
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

  // ---- Team member state ---------------------------------------------------
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [teamData, setTeamData] = useState({
    name: "",
    position: "",
    bio: "",
    phone: "",
    email: "",
    whatsapp: "",
    featured: false,
  });

  const resetPropertyForm = () => {
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
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  const resetTeamForm = () => {
    setTeamData({ name: "", position: "", bio: "", phone: "", email: "", whatsapp: "", featured: false });
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - images.length;
    const toAdd = Array.from(files).slice(0, remaining);

    const withOrientation = await Promise.all(
      toAdd.map(async (file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        orientation: await getImageOrientation(file),
      }))
    );
    setImages((prev) => [...prev, ...withOrientation]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({ title: "Add at least one image", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const property = await createProperty({
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

      // Upload images sequentially so sort_order and the cover flag are correct.
      for (let i = 0; i < images.length; i++) {
        await uploadPropertyImage(property.id, images[i].file, images[i].orientation, {
          isCover: i === 0,
          sortOrder: i,
        });
      }

      toast({ title: "Property Added!", description: "Your property has been successfully listed." });
      resetPropertyForm();
    } catch (error) {
      toast({
        title: "Couldn't add property",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl: string | null = null;
      let storagePath: string | null = null;
      if (avatarFile) {
        const uploaded = await uploadTeamAvatar(avatarFile);
        imageUrl = uploaded.url;
        storagePath = uploaded.path;
      }

      await createTeamMember({
        name: teamData.name,
        position: teamData.position,
        bio: teamData.bio || null,
        image_url: imageUrl,
        storage_path: storagePath,
        phone: teamData.phone || null,
        email: teamData.email || null,
        whatsapp: teamData.whatsapp || null,
        featured: teamData.featured,
        sort_order: 0,
      });

      toast({ title: "Team Member Added!", description: "They now appear on the Team page." });
      resetTeamForm();
    } catch (error) {
      toast({
        title: "Couldn't add team member",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Add New</h1>
          <p className="text-muted-foreground mt-1">Choose what you're adding, then fill in the details.</p>
        </div>

        {/* Category selector */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Label className="mb-3 block">Category</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory("property")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                  category === "property"
                    ? "border-secondary bg-secondary/10"
                    : "border-border hover:border-secondary/50"
                }`}
              >
                <Building2 className="h-6 w-6 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-medium">Property</p>
                  <p className="text-xs text-muted-foreground">List a new property</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setCategory("team")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                  category === "team"
                    ? "border-secondary bg-secondary/10"
                    : "border-border hover:border-secondary/50"
                }`}
              >
                <Users className="h-6 w-6 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-medium">Team Member</p>
                  <p className="text-xs text-muted-foreground">Add a staff profile</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {category === "property" ? (
          <form onSubmit={handlePropertySubmit} className="space-y-8">
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
                      <img src={image.previewUrl} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white capitalize">
                        {image.orientation}
                      </span>
                      {index === 0 && (
                        <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          Cover
                        </span>
                      )}
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
                  Upload up to 10 images. First image is the cover. Portrait and landscape images
                  are detected automatically and laid out differently in the gallery.
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
                      This property will be featured in the Best Deals section, and its landscape
                      images become eligible for the homepage hero slideshow.
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
              <Button type="button" variant="outline" size="lg" onClick={resetPropertyForm}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTeamSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImagePlus className="h-5 w-5" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                    <Upload className="h-5 w-5" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Member Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Claude Mugabo"
                      value={teamData.name}
                      onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      placeholder="Sales Director"
                      value={teamData.position}
                      onChange={(e) => setTeamData({ ...teamData, position: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Short bio..."
                    rows={4}
                    value={teamData.bio}
                    onChange={(e) => setTeamData({ ...teamData, bio: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+250 780 000 000"
                      value={teamData.phone}
                      onChange={(e) => setTeamData({ ...teamData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@ckimhomes.rw"
                      value={teamData.email}
                      onChange={(e) => setTeamData({ ...teamData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="250780000000"
                      value={teamData.whatsapp}
                      onChange={(e) => setTeamData({ ...teamData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured" className="text-base font-medium">Feature on Team Page</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Featured members are highlighted first on the Team page.
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={teamData.featured}
                    onCheckedChange={(checked) => setTeamData({ ...teamData, featured: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                disabled={isSubmitting}
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? "Saving..." : "Save Team Member"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={resetTeamForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddProperty;