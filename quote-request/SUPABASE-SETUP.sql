-- =====================================================================
-- Clean Raccoon — lead system database setup
-- Run this ONCE in your new Supabase project:
--   Supabase dashboard  ->  SQL Editor  ->  New query  ->  paste  ->  Run
-- Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).
-- =====================================================================

-- 1) Leads table -------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  service     text,
  job_type    text,
  full_name   text,
  email       text,
  phone       text,
  details     text,
  photos      jsonb not null default '[]'::jsonb
);

-- 2) Row Level Security:
--    - anyone (the public website) may SUBMIT a lead
--    - only a logged-in admin may READ or DELETE leads
alter table public.leads enable row level security;

drop policy if exists "anon insert leads" on public.leads;
create policy "anon insert leads" on public.leads
  for insert to anon with check (true);

drop policy if exists "auth read leads" on public.leads;
create policy "auth read leads" on public.leads
  for select to authenticated using (true);

drop policy if exists "auth delete leads" on public.leads;
create policy "auth delete leads" on public.leads
  for delete to authenticated using (true);

-- 3) Storage bucket for lead photos -----------------------------------
insert into storage.buckets (id, name, public)
values ('lead-photos', 'lead-photos', true)
on conflict (id) do nothing;

--    - anyone may UPLOAD a photo with their quote
--    - photos are publicly readable (so the dashboard can show them)
--    - only a logged-in admin may DELETE a photo
drop policy if exists "anon upload lead photos" on storage.objects;
create policy "anon upload lead photos" on storage.objects
  for insert to anon with check (bucket_id = 'lead-photos');

drop policy if exists "public read lead photos" on storage.objects;
create policy "public read lead photos" on storage.objects
  for select to public using (bucket_id = 'lead-photos');

drop policy if exists "auth delete lead photos" on storage.objects;
create policy "auth delete lead photos" on storage.objects
  for delete to authenticated using (bucket_id = 'lead-photos');

-- Done. Next: create your admin login user (see the steps in chat).
