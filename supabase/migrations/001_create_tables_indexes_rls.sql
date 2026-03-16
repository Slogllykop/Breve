
-- ============================================================
-- 1. TABLES
-- ============================================================

create table public.whitelisted_emails (
  id bigint generated always as identity primary key,
  email text not null,
  created_at timestamptz not null default now(),
  constraint whitelisted_emails_email_unique unique (email)
);

create table public.links (
  id bigint generated always as identity primary key,
  slug text not null,
  original_url text not null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint links_slug_unique unique (slug)
);

create table public.clicks (
  id bigint generated always as identity primary key,
  link_id bigint not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  device_type text not null default 'unknown',
  country text not null default 'unknown',
  referrer text
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

-- FK index on clicks.link_id (Postgres does NOT auto-index FKs)
create index clicks_link_id_idx on public.clicks (link_id);

-- Time-range queries on clicks
create index clicks_clicked_at_idx on public.clicks (clicked_at);

-- Composite index for analytics GROUP BY queries
create index clicks_link_id_clicked_at_idx on public.clicks (link_id, clicked_at);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.whitelisted_emails enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- Helper: check if the current authenticated user's email is whitelisted
-- Used in RLS policies below
create or replace function public.is_whitelisted()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.whitelisted_emails
    where email = (select auth.email())
  );
$$;

-- whitelisted_emails: only whitelisted authenticated users can CRUD
create policy "whitelisted_emails_select" on public.whitelisted_emails
  for select to authenticated
  using (public.is_whitelisted());

create policy "whitelisted_emails_insert" on public.whitelisted_emails
  for insert to authenticated
  with check (public.is_whitelisted());

create policy "whitelisted_emails_delete" on public.whitelisted_emails
  for delete to authenticated
  using (public.is_whitelisted());

-- links: only whitelisted authenticated users can CRUD
create policy "links_select" on public.links
  for select to authenticated
  using (public.is_whitelisted());

create policy "links_insert" on public.links
  for insert to authenticated
  with check (public.is_whitelisted());

create policy "links_update" on public.links
  for update to authenticated
  using (public.is_whitelisted())
  with check (public.is_whitelisted());

create policy "links_delete" on public.links
  for delete to authenticated
  using (public.is_whitelisted());

-- clicks: anonymous inserts allowed (from redirect endpoint)
-- reads restricted to whitelisted authenticated users
create policy "clicks_insert_anon" on public.clicks
  for insert to anon, authenticated
  with check (true);

create policy "clicks_select" on public.clicks
  for select to authenticated
  using (public.is_whitelisted());

-- ============================================================
-- 4. UPDATED_AT TRIGGER for links
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger links_updated_at
  before update on public.links
  for each row
  execute function public.handle_updated_at();
