-- ============================================================================
-- Migration 3: Storage buckets + storage policies
-- property-images : property gallery uploads (public read)
-- team-avatars    : team member photos (public read)
-- site-assets     : company logo (public read)
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('property-images', 'property-images', true),
  ('team-avatars', 'team-avatars', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- Public read access for all three buckets
create policy "Public can read property images bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

create policy "Public can read team avatars bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'team-avatars');

create policy "Public can read site assets bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-assets');

-- Authenticated (admin) upload / update / delete
create policy "Authenticated can upload property images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

create policy "Authenticated can update property images bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images');

create policy "Authenticated can delete property images bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');

create policy "Authenticated can upload team avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'team-avatars');

create policy "Authenticated can update team avatars bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'team-avatars');

create policy "Authenticated can delete team avatars bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'team-avatars');

create policy "Authenticated can upload site assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-assets');

create policy "Authenticated can update site assets bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-assets');

create policy "Authenticated can delete site assets bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-assets');
