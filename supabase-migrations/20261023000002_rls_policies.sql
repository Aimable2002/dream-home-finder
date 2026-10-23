-- ============================================================================
-- Migration 2: Row Level Security policies
-- Public visitors can browse listings and submit inquiries.
-- Admin actions (create/update/delete) require an authenticated session.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create policy "Public can read properties"
  on public.properties for select
  to anon, authenticated
  using (true);

create policy "Authenticated can insert properties"
  on public.properties for insert
  to authenticated
  with check (true);

create policy "Authenticated can update properties"
  on public.properties for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete properties"
  on public.properties for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- property_images
-- ---------------------------------------------------------------------------
create policy "Public can read property images"
  on public.property_images for select
  to anon, authenticated
  using (true);

create policy "Authenticated can manage property images"
  on public.property_images for insert
  to authenticated
  with check (true);

create policy "Authenticated can update property images"
  on public.property_images for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete property images"
  on public.property_images for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- team_members
-- ---------------------------------------------------------------------------
create policy "Public can read team members"
  on public.team_members for select
  to anon, authenticated
  using (true);

create policy "Authenticated can manage team members"
  on public.team_members for insert
  to authenticated
  with check (true);

create policy "Authenticated can update team members"
  on public.team_members for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete team members"
  on public.team_members for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- site_settings (public read so the site can load branding; admin write)
-- ---------------------------------------------------------------------------
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Authenticated can update site settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- inquiries: anyone may submit; only authenticated admins may read/manage
-- ---------------------------------------------------------------------------
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated can read inquiries"
  on public.inquiries for select
  to authenticated
  using (true);

create policy "Authenticated can update inquiries"
  on public.inquiries for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete inquiries"
  on public.inquiries for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- user_roles: users may read their own roles; admins may read all
-- ---------------------------------------------------------------------------
create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- OPTIONAL HARDENING (run later, once real admin accounts + user_roles rows
-- exist). Example: replace the write policies above with admin-only versions:
--
--   drop policy "Authenticated can insert properties" on public.properties;
--   create policy "Admins can insert properties"
--     on public.properties for insert to authenticated
--     with check (public.has_role(auth.uid(), 'admin'));
--
--   -- and grant the admin role to an existing user:
--   insert into public.user_roles (user_id, role)
--   select id, 'admin' from auth.users where email = 'admin@imenahomes.rw'
--   on conflict do nothing;
-- ============================================================================
