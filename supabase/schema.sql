-- =====================================================================
-- My Life Space — skema database
-- Cara pakai: buka Supabase → SQL Editor → New query → tempel semua → Run
-- =====================================================================

-- ---------- Admin (siapa pemilik website) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Fungsi bantu: apakah user yang sedang login adalah admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Profil (1 baris) ----------
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default 'Nama Kamu',
  tagline text default '',
  bio text default '',
  avatar_url text,
  skills text[] default '{}',
  interests text[] default '{}',
  socials jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public.profile (id) values (1) on conflict do nothing;

-- ---------- Timeline hidup ----------
create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- Pencapaian ----------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  description text,
  image_url text,
  category text,
  highlight boolean default false,
  created_at timestamptz default now()
);

-- ---------- Tempat yang dikunjungi ----------
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  country text,
  lat double precision,
  lng double precision,
  visited_at date,
  story text,
  cover_url text,
  created_at timestamptz default now()
);

create table if not exists public.place_media (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  type text not null check (type in ('image','video')),
  url text not null,
  poster_url text,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- Jurnal ----------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text default '',
  tags text[] default '{}',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- Buku tamu ----------
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 500),
  emoji text,
  status text not null default 'unread' check (status in ('unread','read','hidden')),
  ip_hash text,
  created_at timestamptz default now()
);
create index if not exists guestbook_ip_time on public.guestbook (ip_hash, created_at desc);

-- =====================================================================
-- Row Level Security: publik baca, admin tulis
-- =====================================================================
alter table public.admins enable row level security;
alter table public.profile enable row level security;
alter table public.timeline enable row level security;
alter table public.achievements enable row level security;
alter table public.places enable row level security;
alter table public.place_media enable row level security;
alter table public.journal_entries enable row level security;
alter table public.guestbook enable row level security;

create policy "admin lihat admins" on public.admins for select using (public.is_admin());

-- Tabel konten: semua orang boleh baca, admin boleh semuanya
do $$
declare t text;
begin
  foreach t in array array['profile','timeline','achievements','places','place_media'] loop
    execute format('create policy "public read %1$s" on public.%1$I for select using (true)', t);
    execute format('create policy "admin write %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Jurnal: publik hanya lihat yang published
create policy "public read journal" on public.journal_entries
  for select using (published or public.is_admin());
create policy "admin write journal" on public.journal_entries
  for all using (public.is_admin()) with check (public.is_admin());

-- Buku tamu: publik lihat yang tidak disembunyikan; insert lewat API server (service role)
create policy "public read guestbook" on public.guestbook
  for select using (status <> 'hidden' or public.is_admin());
create policy "admin manage guestbook" on public.guestbook
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Storage: bucket foto & video
-- =====================================================================
insert into storage.buckets (id, name, public) values ('images','images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('videos','videos', true) on conflict do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id in ('images','videos'));
create policy "admin upload media" on storage.objects
  for insert with check (bucket_id in ('images','videos') and public.is_admin());
create policy "admin update media" on storage.objects
  for update using (bucket_id in ('images','videos') and public.is_admin());
create policy "admin delete media" on storage.objects
  for delete using (bucket_id in ('images','videos') and public.is_admin());

-- =====================================================================
-- LANGKAH TERAKHIR (setelah kamu membuat akun di Authentication → Users):
-- ganti email di bawah lalu jalankan baris ini sendiri.
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'emailkamu@contoh.com';
-- =====================================================================
