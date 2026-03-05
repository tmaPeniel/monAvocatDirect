-- ============================================================================
-- MonAvocatDirect - Complete Supabase SQL Schema
-- ============================================================================
-- This file creates the full database schema for the MonAvocatDirect platform,
-- a lawyer-client booking application. Run this in the Supabase SQL Editor.
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Ensure the uuid-ossp extension is available (Supabase enables it by default)
create extension if not exists "uuid-ossp";


-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- 2a. profiles
-- Stores user profile data. Each row maps 1:1 to a Supabase auth.users entry.
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                    uuid        references auth.users on delete cascade primary key,
  email                 text,
  nom                   text,
  prenom                text,
  role                  text        check (role in ('client', 'avocat', 'admin')),
  telephone             text,
  specialite            text,
  ville                 text,
  description           text,
  photo_url             text,
  tarif                 numeric,
  aide_juridictionnelle boolean     default false,
  cal_link              text,
  is_verified           boolean     default false,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

comment on table public.profiles is 'User profiles linked to Supabase auth.users';

-- ──────────────────────────────────────────────────────────────────────────────
-- 2b. cases
-- Legal cases (dossiers). Each case belongs to a client and may be assigned
-- to a lawyer.
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.cases (
  id          uuid        default gen_random_uuid() primary key,
  titre       text        not null,
  description text,
  statut      text        default 'en_attente'
                          check (statut in ('en_attente', 'en_cours', 'termine')),
  client_id   uuid        references public.profiles (id) on delete cascade,
  avocat_id   uuid        references public.profiles (id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

comment on table public.cases is 'Legal cases (dossiers) linking clients to lawyers';

-- ──────────────────────────────────────────────────────────────────────────────
-- 2c. documents
-- Files attached to a case (contracts, evidence, correspondence, etc.).
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id          uuid        default gen_random_uuid() primary key,
  case_id     uuid        references public.cases (id) on delete cascade,
  name        text        not null,
  file_path   text        not null,
  file_size   bigint,
  uploaded_by uuid        references public.profiles (id),
  created_at  timestamptz default now()
);

comment on table public.documents is 'Documents attached to a legal case';


-- ============================================================================
-- 3. INDEXES
-- ============================================================================
-- Indexes on columns frequently used in WHERE, JOIN, and ORDER BY clauses.

-- profiles
create index if not exists idx_profiles_role       on public.profiles (role);
create index if not exists idx_profiles_ville      on public.profiles (ville);
create index if not exists idx_profiles_specialite on public.profiles (specialite);
create index if not exists idx_profiles_is_verified on public.profiles (is_verified);
create index if not exists idx_profiles_email      on public.profiles (email);

-- cases
create index if not exists idx_cases_client_id on public.cases (client_id);
create index if not exists idx_cases_avocat_id on public.cases (avocat_id);
create index if not exists idx_cases_statut    on public.cases (statut);
create index if not exists idx_cases_created   on public.cases (created_at);

-- documents
create index if not exists idx_documents_case_id     on public.documents (case_id);
create index if not exists idx_documents_uploaded_by  on public.documents (uploaded_by);


-- ============================================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================================
-- Automatically set updated_at to now() on every UPDATE.

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply the trigger to tables that have an updated_at column
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_cases_updated_at
  before update on public.cases
  for each row
  execute function public.handle_updated_at();


-- ============================================================================
-- 5. HANDLE NEW USER (auth trigger)
-- ============================================================================
-- Automatically create a profiles row when a new user signs up via Supabase Auth.
-- The role and metadata are read from raw_user_meta_data set during signUp().

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    nom,
    prenom,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    coalesce(new.raw_user_meta_data ->> 'prenom', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'client')
  );
  return new;
end;
$$;

-- Trigger: fires after a new row is inserted into auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles  enable row level security;
alter table public.cases     enable row level security;
alter table public.documents enable row level security;

-- ──────────────────────────────────────────────────────────────────────────────
-- 6a. profiles policies
-- ──────────────────────────────────────────────────────────────────────────────

-- Anyone (authenticated) can read avocat profiles (for the public search page)
create policy "Avocat profiles are viewable by everyone"
  on public.profiles
  for select
  using (role = 'avocat');

-- Users can read their own profile regardless of role
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can view all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can delete any profile
create policy "Admins can delete any profile"
  on public.profiles
  for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ──────────────────────────────────────────────────────────────────────────────
-- 6b. cases policies
-- ──────────────────────────────────────────────────────────────────────────────

-- Clients can see their own cases
create policy "Clients can view their own cases"
  on public.cases
  for select
  using (auth.uid() = client_id);

-- Clients can create cases
create policy "Clients can create cases"
  on public.cases
  for insert
  with check (auth.uid() = client_id);

-- Clients can update their own cases
create policy "Clients can update their own cases"
  on public.cases
  for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

-- Avocats can see cases assigned to them
create policy "Avocats can view their assigned cases"
  on public.cases
  for select
  using (auth.uid() = avocat_id);

-- Avocats can update cases assigned to them
create policy "Avocats can update their assigned cases"
  on public.cases
  for update
  using (auth.uid() = avocat_id)
  with check (auth.uid() = avocat_id);

-- Admins can see all cases
create policy "Admins can view all cases"
  on public.cases
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all cases
create policy "Admins can update all cases"
  on public.cases
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can delete any case
create policy "Admins can delete any case"
  on public.cases
  for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ──────────────────────────────────────────────────────────────────────────────
-- 6c. documents policies
-- ──────────────────────────────────────────────────────────────────────────────

-- Users involved in the case (client or assigned avocat) can read documents
create policy "Case participants can view documents"
  on public.documents
  for select
  using (
    exists (
      select 1 from public.cases
      where cases.id = documents.case_id
        and (cases.client_id = auth.uid() or cases.avocat_id = auth.uid())
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users involved in the case can upload documents
create policy "Case participants can insert documents"
  on public.documents
  for insert
  with check (
    exists (
      select 1 from public.cases
      where cases.id = case_id
        and (cases.client_id = auth.uid() or cases.avocat_id = auth.uid())
    )
  );

-- Users involved in the case can delete documents they uploaded
create policy "Case participants can delete their documents"
  on public.documents
  for delete
  using (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.cases
      where cases.id = documents.case_id
        and (cases.client_id = auth.uid() or cases.avocat_id = auth.uid())
    )
  );

-- Admins can manage all documents
create policy "Admins can manage all documents"
  on public.documents
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================================
-- 7. STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets for documents and avatars
insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- ──────────────────────────────────────────────────────────────────────────────
-- 7a. Storage policies - documents bucket
-- ──────────────────────────────────────────────────────────────────────────────

-- Authenticated users can upload documents
create policy "Authenticated users can upload documents"
  on storage.objects
  for insert
  with check (
    bucket_id = 'documents'
    and auth.role() = 'authenticated'
  );

-- Users can read documents they have access to (via case participation)
create policy "Case participants can read document files"
  on storage.objects
  for select
  using (
    bucket_id = 'documents'
    and auth.role() = 'authenticated'
  );

-- Users can delete their own uploaded documents
create policy "Users can delete their own document files"
  on storage.objects
  for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ──────────────────────────────────────────────────────────────────────────────
-- 7b. Storage policies - avatars bucket
-- ──────────────────────────────────────────────────────────────────────────────

-- Anyone can view avatars (bucket is public)
create policy "Avatars are publicly accessible"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatar
create policy "Users can update their own avatar"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================================
-- 8. MESSAGES TABLE
-- ============================================================================
-- Messages linked to a case, exchanged between client and lawyer.

-- ──────────────────────────────────────────────────────────────────────────────
-- 8a. messages table
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id         uuid        default gen_random_uuid() primary key,
  case_id    uuid        not null references public.cases (id) on delete cascade,
  sender_id  uuid        not null references public.profiles (id),
  content    text        not null,
  created_at timestamptz default now(),
  read_at    timestamptz
);

comment on table public.messages is 'Messages exchanged between case participants (client & lawyer)';

-- Indexes
create index if not exists idx_messages_case_id   on public.messages (case_id);
create index if not exists idx_messages_sender_id on public.messages (sender_id);
create index if not exists idx_messages_created   on public.messages (created_at);

-- Enable RLS
alter table public.messages enable row level security;

-- Case participants can view messages
create policy "Participants can view messages"
  on public.messages
  for select
  using (
    exists (
      select 1 from public.cases
      where cases.id = messages.case_id
        and (cases.client_id = auth.uid() or cases.avocat_id = auth.uid())
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Case participants can send messages
create policy "Participants can send messages"
  on public.messages
  for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.cases
      where cases.id = case_id
        and (cases.client_id = auth.uid() or cases.avocat_id = auth.uid())
    )
  );

-- Participants can mark messages as read (update read_at)
create policy "Participants can mark messages as read"
  on public.messages
  for update
  using (
    exists (
      select 1 from public.cases
      where cases.id = messages.case_id
        and (cases.client_id = auth.uid() or cases.avocat_id = auth.uid())
    )
  );


-- ============================================================================
-- 9. DISPONIBILITES COLUMN
-- ============================================================================
-- JSONB column on profiles to store lawyer's indicative weekly schedule.
-- Structure: { "lundi": { "matin": true, "apres_midi": false, "soir": false }, ... }

alter table public.profiles add column if not exists disponibilites jsonb;


-- ============================================================================
-- 10. DONE
-- ============================================================================
-- Schema setup complete. Summary:
--   - 4 tables: profiles, cases, documents, messages
--   - Indexes on frequently queried columns
--   - Auto-updating updated_at trigger
--   - Auth trigger to create profile on sign-up
--   - Row Level Security policies for all tables
--   - Storage buckets (documents, avatars) with access policies
--   - disponibilites JSONB column on profiles (lawyer weekly schedule)
-- ============================================================================
