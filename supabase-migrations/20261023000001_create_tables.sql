-- ============================================================================
-- Migration 1: Core tables for ImenaHomes (real estate platform)
-- Run against project: seilaswjzerlycvqrwxz
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Properties (houses / apartments / villas / land / commercial)
-- ---------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(14, 2) not null default 0,
  location text not null,
  address text,
  description text,
  type text not null check (type in ('sale', 'rent')),
  property_type text not null check (property_type in ('house', 'apartment', 'villa', 'land', 'commercial')),
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  parking integer not null default 0,
  size numeric(12, 2),
  is_best_deal boolean not null default false,
  is_featured boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.properties to anon;
grant select, insert, update, delete on public.properties to authenticated;
grant all on public.properties to service_role;

alter table public.properties enable row level security;

-- ---------------------------------------------------------------------------
-- Property images (multi-image galleries)
-- ---------------------------------------------------------------------------
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  url text not null,
  storage_path text not null,
  orientation text not null default 'landscape' check (orientation in ('landscape', 'portrait')),
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.property_images to anon;
grant select, insert, update, delete on public.property_images to authenticated;
grant all on public.property_images to service_role;

alter table public.property_images enable row level security;

create index if not exists property_images_property_id_idx
  on public.property_images (property_id);

-- ---------------------------------------------------------------------------
-- Team members
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  bio text,
  image_url text,
  storage_path text,
  phone text,
  email text,
  whatsapp text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;

alter table public.team_members enable row level security;

-- ---------------------------------------------------------------------------
-- Site settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  company_name text not null default 'ImenaHomes',
  logo_url text,
  logo_storage_path text,
  email text,
  phone text,
  whatsapp text,
  address text,
  website text,
  facebook text,
  instagram text,
  twitter text,
  linkedin text,
  stats_properties_listed text,
  stats_happy_clients text,
  stats_years_experience text,
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------------
-- Inquiries (contact form submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

grant insert on public.inquiries to anon;
grant select, insert, update, delete on public.inquiries to authenticated;
grant all on public.inquiries to service_role;

alter table public.inquiries enable row level security;

-- ---------------------------------------------------------------------------
-- Admin roles (for hardening admin-only access later)
-- The current app treats any authenticated user as admin; once you create
-- real admin accounts you can switch write policies to has_role() below.
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'moderator', 'user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- View counter RPC (called by the public site, no auth required)
-- ---------------------------------------------------------------------------
create or replace function public.increment_property_views(property_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.properties
  set views = views + 1
  where id = property_id;
$$;

grant execute on function public.increment_property_views(uuid) to anon, authenticated;
