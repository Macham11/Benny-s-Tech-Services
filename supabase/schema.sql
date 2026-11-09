-- =====================================================================
-- Benny's Tech Services: database setup
-- Run this ONCE in Supabase: SQL Editor > New query > paste > Run
-- It is safe to run again (it will not delete your data).
--
-- ADMIN EMAIL: only this email can add, edit or delete data.
-- If you use a different email for admin login, change it in the
-- 4 places below that say machambwehb@gmail.com
-- =====================================================================

-- 1. TABLES ------------------------------------------------------------

create table if not exists public.services (
  id          bigint generated always as identity primary key,
  title       text not null check (char_length(title) between 2 and 150),
  category    text not null check (category in ('cyber-cafe','business-centre','scratch-cards','training')),
  section     text check (section in ('jamb','exam','docs')),
  description text not null default '',
  trending    boolean not null default false,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.posts (
  id         bigint generated always as identity primary key,
  title      text not null check (char_length(title) between 2 and 200),
  slug       text not null unique check (slug ~ '^[a-z0-9-]+$'),
  content    text not null default '',
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id         bigint generated always as identity primary key,
  name       text not null default '' check (char_length(name) <= 100),
  phone      text not null default '' check (char_length(phone) <= 30),
  service    text not null default '' check (char_length(service) <= 150),
  message    text not null default '' check (char_length(message) <= 1000),
  created_at timestamptz not null default now()
);

-- 2. SECURITY (Row Level Security) -------------------------------------

alter table public.services  enable row level security;
alter table public.posts     enable row level security;
alter table public.enquiries enable row level security;

-- Services: everyone can read active ones; only admin can change anything
drop policy if exists "Public reads active services" on public.services;
create policy "Public reads active services" on public.services
  for select to anon, authenticated using (active = true);

drop policy if exists "Admin manages services" on public.services;
create policy "Admin manages services" on public.services
  for all to authenticated
  using ((auth.jwt() ->> 'email') = 'machambwehb@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'machambwehb@gmail.com');

-- Posts: everyone can read published ones; only admin can change anything
drop policy if exists "Public reads published posts" on public.posts;
create policy "Public reads published posts" on public.posts
  for select to anon, authenticated using (published = true);

drop policy if exists "Admin manages posts" on public.posts;
create policy "Admin manages posts" on public.posts
  for all to authenticated
  using ((auth.jwt() ->> 'email') = 'machambwehb@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'machambwehb@gmail.com');

-- Enquiries: the public can ONLY add one (cannot read others); admin sees all
drop policy if exists "Public sends enquiries" on public.enquiries;
create policy "Public sends enquiries" on public.enquiries
  for insert to anon, authenticated
  with check (char_length(service) > 0 or char_length(message) > 0);

drop policy if exists "Admin manages enquiries" on public.enquiries;
create policy "Admin manages enquiries" on public.enquiries
  for all to authenticated
  using ((auth.jwt() ->> 'email') = 'machambwehb@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'machambwehb@gmail.com');

-- 3. STARTING SERVICES (added only if the services table is empty) -------

insert into public.services (title, category, section, description, trending)
select * from (values
  ('JAMB Admission Acceptance', 'cyber-cafe', 'jamb', 'Get help accepting your JAMB admission on the portal.', true),
  ('JAMB Online Registration',  'cyber-cafe', 'jamb', 'Online registration help for JAMB.', false),
  ('JAMB Result Checking',      'cyber-cafe', 'jamb', 'Check your JAMB result online.', false),
  ('WAEC Scratch Card',         'scratch-cards', 'exam', 'Buy your WAEC scratch card here.', true),
  ('NECO Scratch Card',         'scratch-cards', 'exam', 'Buy your NECO scratch card here.', true),
  ('NECO e-Verification Pin',   'scratch-cards', 'exam', 'Buy a NECO e-verification pin.', false),
  ('NABTEB Scratch Card',       'scratch-cards', 'exam', 'Buy your NABTEB scratch card here.', false),
  ('WAEC Result Checking',      'cyber-cafe', 'exam', 'Check your WAEC result online.', false),
  ('NECO Result Checking',      'cyber-cafe', 'exam', 'Check your NECO result online.', false),
  ('NABTEB Result Checking',    'cyber-cafe', 'exam', 'Check your NABTEB result online.', false),
  ('Typing',                    'business-centre', 'docs', 'Neat and accurate typing of your documents.', true),
  ('CV / Resume Creation',      'business-centre', 'docs', 'A clean, professional CV or resume for your job search.', true),
  ('Report Writing',            'business-centre', 'docs', 'Help with writing and arranging reports.', false),
  ('Application Letter Writing','business-centre', 'docs', 'Application letters for jobs, schools and more.', false),
  ('Typesetting',               'business-centre', 'docs', 'Neat typesetting and layout of your documents.', false),
  ('Printing',                  'business-centre', 'docs', 'Printing of your documents.', false),
  ('Photocopying',              'business-centre', 'docs', 'Photocopying of your documents.', false),
  ('Online Registrations',      'cyber-cafe', null, 'Help with all kinds of online registrations.', true),
  ('Computer Training',         'training', null, 'Learn computer skills with practical training.', true)
) as v(title, category, section, description, trending)
where not exists (select 1 from public.services);
