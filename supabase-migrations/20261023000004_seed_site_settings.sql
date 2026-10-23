-- ============================================================================
-- Migration 4: Seed the single site_settings row for ImenaHomes
-- ============================================================================

insert into public.site_settings (
  id,
  company_name,
  email,
  phone,
  whatsapp,
  address,
  website,
  stats_properties_listed,
  stats_happy_clients,
  stats_years_experience
)
values (
  1,
  'ImenaHomes',
  'info@imenahomes.rw',
  '+250780000000',
  '+250780000000',
  'Kigali, Rwanda',
  'https://imenahomes.rw',
  '500+',
  '1,200+',
  '15+'
)
on conflict (id) do nothing;
