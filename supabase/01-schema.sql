create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  property_type text not null,
  listing_type text not null check (listing_type in ('aluguel', 'venda')),
  registration_status text not null default 'ativo' check (registration_status in ('ativo', 'vendido', 'suspenso', 'inativo')),
  price numeric not null default 0,
  gross_price numeric not null default 0,
  punctuality_discount numeric not null default 0,
  condo_fee numeric not null default 0,
  water_notes text,
  area_m2 numeric not null default 0,
  bedrooms integer not null default 0,
  suites integer not null default 0,
  bathrooms integer not null default 0,
  has_dce boolean not null default false,
  garage_spaces integer not null default 0,
  address text not null,
  neighborhood text not null,
  condominium_name text,
  description text,
  gallery jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  gradient text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_listing_type on public.properties (listing_type);
create index if not exists idx_properties_registration_status on public.properties (registration_status);
create index if not exists idx_properties_is_active on public.properties (is_active);
create index if not exists idx_properties_is_featured on public.properties (is_featured);
create index if not exists idx_properties_neighborhood on public.properties (neighborhood);
create index if not exists idx_properties_created_at on public.properties (created_at desc);
