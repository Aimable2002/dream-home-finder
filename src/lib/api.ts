/**
 * src/lib/api.ts
 * ----------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every request the app makes (auth, properties,
 * property images, team members, site settings, storage uploads).
 *
 * Rule: components and pages NEVER import `supabase` directly. They only
 * import functions from this file. This keeps every query in one place so
 * the data layer can be audited/changed without touching UI code.
 * ----------------------------------------------------------------------------
 */

import { supabase } from "@/lib/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

export type ListingType = "sale" | "rent";
export type PropertyType = "house" | "apartment" | "villa" | "land" | "commercial";
export type Orientation = "landscape" | "portrait";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  address: string | null;
  description: string | null;
  type: ListingType;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size: number | null;
  is_best_deal: boolean;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  storage_path: string;
  orientation: Orientation;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  image_url: string | null;
  storage_path: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  logo_url: string | null;
  logo_storage_path: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  stats_properties_listed: string | null;
  stats_happy_clients: string | null;
  stats_years_experience: string | null;
  updated_at: string;
}

export type InquiryStatus = "new" | "read";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

// Payload shapes used when creating/editing from the admin forms.
export type PropertyInput = Omit<
  Property,
  "id" | "created_at" | "updated_at" | "views"
>;

export type TeamMemberInput = Omit<TeamMember, "id" | "created_at" | "updated_at">;

export type SiteSettingsInput = Omit<SiteSettings, "id" | "updated_at">;

// ============================================================================
// AUTH
// ============================================================================

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function onAuthStateChange(callback: (isLoggedIn: boolean) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  return () => data.subscription.unsubscribe();
}

// ============================================================================
// PROPERTIES
// ============================================================================

export interface GetPropertiesFilters {
  type?: ListingType;
  propertyType?: PropertyType;
  isBestDeal?: boolean;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
}

export async function getProperties(
  filters: GetPropertiesFilters = {}
): Promise<PropertyWithImages[]> {
  let query = supabase
    .from("properties")
    .select("*, property_images(*)")
    .order("created_at", { ascending: false });

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
  if (filters.isBestDeal !== undefined) query = query.eq("is_best_deal", filters.isBestDeal);
  if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
  }
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data as PropertyWithImages[]) ?? [];
}

export async function getProperty(id: string): Promise<PropertyWithImages | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as PropertyWithImages | null;
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Property;
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  // property_images rows cascade-delete via FK; storage files should be
  // removed first by the caller using deletePropertyImage() for each image.
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleBestDeal(id: string, isBestDeal: boolean): Promise<Property> {
  return updateProperty(id, { is_best_deal: isBestDeal });
}

export async function incrementPropertyViews(id: string): Promise<void> {
  const { error } = await supabase.rpc("increment_property_views", { property_id: id });
  // Non-critical — don't throw if the RPC function hasn't been created.
  if (error) console.warn("[api] incrementPropertyViews failed:", error.message);
}

// ============================================================================
// PROPERTY IMAGES
// ============================================================================

/**
 * Uploads a single image file to the `property-images` bucket and inserts
 * the matching property_images row. Orientation is measured client-side
 * (natural width vs height) by the caller and passed in — see
 * src/lib/images.ts for the helper that measures it.
 */
export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  orientation: Orientation,
  opts: { isCover?: boolean; sortOrder?: number } = {}
): Promise<PropertyImage> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${propertyId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("property_images")
    .insert({
      property_id: propertyId,
      url: publicUrlData.publicUrl,
      storage_path: path,
      orientation,
      is_cover: opts.isCover ?? false,
      sort_order: opts.sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as PropertyImage;
}

export async function deletePropertyImage(image: PropertyImage): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from("property-images")
    .remove([image.storage_path]);
  if (storageError) throw storageError;

  const { error } = await supabase.from("property_images").delete().eq("id", image.id);
  if (error) throw error;
}

export async function setCoverImage(propertyId: string, imageId: string): Promise<void> {
  // Unset any existing cover, then set the new one.
  const { error: clearError } = await supabase
    .from("property_images")
    .update({ is_cover: false })
    .eq("property_id", propertyId);
  if (clearError) throw clearError;

  const { error } = await supabase
    .from("property_images")
    .update({ is_cover: true })
    .eq("id", imageId);
  if (error) throw error;
}

/**
 * Hero-eligible images: landscape images belonging to best-deal / featured
 * properties. Used by the HeroSection slideshow.
 */
export async function getHeroImages(): Promise<{ url: string; propertyTitle: string }[]> {
  const { data, error } = await supabase
    .from("property_images")
    .select("url, orientation, properties!inner(title, is_best_deal, is_featured)")
    .eq("orientation", "landscape")
    .or("is_best_deal.eq.true,is_featured.eq.true", { foreignTable: "properties" });
  if (error) throw error;
  type HeroRow = { url: string; properties: { title: string } | null };
  return ((data ?? []) as HeroRow[]).map((row) => ({
    url: row.url,
    propertyTitle: row.properties?.title ?? "",
  }));
}

// ============================================================================
// TEAM MEMBERS
// ============================================================================

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as TeamMember[]) ?? [];
}

export async function createTeamMember(input: TeamMemberInput): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as TeamMember;
}

export async function updateTeamMember(
  id: string,
  input: Partial<TeamMemberInput>
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as TeamMember;
}

export async function deleteTeamMember(member: TeamMember): Promise<void> {
  if (member.storage_path) {
    await supabase.storage.from("team-avatars").remove([member.storage_path]);
  }
  const { error } = await supabase.from("team_members").delete().eq("id", member.id);
  if (error) throw error;
}

export async function uploadTeamAvatar(
  file: File
): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("team-avatars")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("team-avatars").getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// ============================================================================
// SITE SETTINGS
// ============================================================================

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function updateSettings(input: Partial<SiteSettingsInput>): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .update(input)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function uploadLogo(file: File): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() || "png";
  const path = `logo-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-assets")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// ============================================================================
// DASHBOARD (aggregate stats for AdminDashboard)
// ============================================================================

export async function getDashboardStats() {
  const [{ count: total }, { count: forSale }, { count: forRent }, { count: bestDeals }, unreadInquiries] =
    await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("type", "sale"),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("type", "rent"),
      supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("is_best_deal", true),
      getUnreadInquiriesCount().catch(() => 0),
    ]);

  return {
    total: total ?? 0,
    forSale: forSale ?? 0,
    forRent: forRent ?? 0,
    bestDeals: bestDeals ?? 0,
    unreadInquiries,
  };
}

export async function getRecentProperties(limit = 5): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Property[]) ?? [];
}

// ============================================================================
// INQUIRIES (Contact form submissions)
// ============================================================================

export type InquiryInput = Pick<Inquiry, "name" | "email" | "phone" | "message">;

/** Public — anyone can submit a contact form message. No auth required. */
export async function createInquiry(input: InquiryInput): Promise<void> {
  const { error } = await supabase.from("inquiries").insert({ ...input, status: "new" });
  if (error) throw error;
}

/** Admin-only — reading inquiries requires an authenticated session (see RLS). */
export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Inquiry[]) ?? [];
}

export async function markInquiryRead(id: string): Promise<void> {
  const { error } = await supabase.from("inquiries").update({ status: "read" }).eq("id", id);
  if (error) throw error;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
}

export async function getUnreadInquiriesCount(): Promise<number> {
  const { count, error } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
}