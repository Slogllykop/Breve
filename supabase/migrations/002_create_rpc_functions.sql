
-- ============================================================
-- RPC FUNCTIONS
-- All called via supabase.rpc() from the app
-- ============================================================

-- 1. check_whitelist: verify if an email is whitelisted
create or replace function public.check_whitelist(p_email text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.whitelisted_emails
    where lower(email) = lower(p_email)
  );
$$;

-- 2. get_all_links: returns all links with their click counts
create or replace function public.get_all_links()
returns table (
  id bigint,
  slug text,
  original_url text,
  title text,
  created_at timestamptz,
  updated_at timestamptz,
  click_count bigint
)
language sql
security invoker
stable
as $$
  select
    l.id,
    l.slug,
    l.original_url,
    l.title,
    l.created_at,
    l.updated_at,
    count(c.id) as click_count
  from public.links l
  left join public.clicks c on c.link_id = l.id
  group by l.id
  order by l.created_at desc;
$$;

-- 3. get_link_by_slug: for redirect lookups
create or replace function public.get_link_by_slug(p_slug text)
returns table (
  id bigint,
  original_url text
)
language sql
security definer
stable
as $$
  select id, original_url
  from public.links
  where slug = p_slug
  limit 1;
$$;

-- 4. create_link: inserts a new link
create or replace function public.create_link(
  p_slug text,
  p_original_url text,
  p_title text default null
)
returns table (
  id bigint,
  slug text,
  original_url text,
  title text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security invoker
as $$
  insert into public.links (slug, original_url, title)
  values (p_slug, p_original_url, p_title)
  returning id, slug, original_url, title, created_at, updated_at;
$$;

-- 5. update_link: updates an existing link
create or replace function public.update_link(
  p_id bigint,
  p_slug text,
  p_original_url text,
  p_title text default null
)
returns table (
  id bigint,
  slug text,
  original_url text,
  title text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security invoker
as $$
  update public.links
  set slug = p_slug,
      original_url = p_original_url,
      title = p_title
  where id = p_id
  returning id, slug, original_url, title, created_at, updated_at;
$$;

-- 6. delete_link: deletes a link (cascades to clicks)
create or replace function public.delete_link(p_id bigint)
returns void
language sql
security invoker
as $$
  delete from public.links where id = p_id;
$$;

-- 7. record_click: inserts a click (called from redirect endpoint)
create or replace function public.record_click(
  p_link_id bigint,
  p_device_type text default 'unknown',
  p_country text default 'unknown',
  p_referrer text default null
)
returns void
language sql
security definer
as $$
  insert into public.clicks (link_id, device_type, country, referrer)
  values (p_link_id, p_device_type, p_country, p_referrer);
$$;

-- 8. get_link_analytics: aggregated click data for charts
create or replace function public.get_link_analytics(
  p_link_id bigint,
  p_period text default 'month'
)
returns table (
  date text,
  click_count bigint
)
language plpgsql
security invoker
stable
as $$
declare
  v_interval interval;
  v_trunc text;
begin
  case p_period
    when 'week' then
      v_interval := interval '7 days';
      v_trunc := 'day';
    when 'month' then
      v_interval := interval '30 days';
      v_trunc := 'day';
    when 'year' then
      v_interval := interval '365 days';
      v_trunc := 'month';
    when 'all' then
      v_interval := interval '100 years';
      v_trunc := 'month';
    else
      v_interval := interval '30 days';
      v_trunc := 'day';
  end case;

  return query
    select
      to_char(date_trunc(v_trunc, c.clicked_at), 'YYYY-MM-DD') as date,
      count(*)::bigint as click_count
    from public.clicks c
    where c.link_id = p_link_id
      and c.clicked_at >= now() - v_interval
    group by date_trunc(v_trunc, c.clicked_at)
    order by date_trunc(v_trunc, c.clicked_at);
end;
$$;

-- 9. get_device_analytics: device type breakdown
create or replace function public.get_device_analytics(p_link_id bigint)
returns table (
  device_type text,
  click_count bigint
)
language sql
security invoker
stable
as $$
  select
    c.device_type,
    count(*)::bigint as click_count
  from public.clicks c
  where c.link_id = p_link_id
  group by c.device_type
  order by click_count desc;
$$;

-- 10. get_country_analytics: country breakdown
create or replace function public.get_country_analytics(p_link_id bigint)
returns table (
  country text,
  click_count bigint
)
language sql
security invoker
stable
as $$
  select
    c.country,
    count(*)::bigint as click_count
  from public.clicks c
  where c.link_id = p_link_id
  group by c.country
  order by click_count desc;
$$;

-- 11. get_whitelisted_emails: returns all whitelisted emails
create or replace function public.get_whitelisted_emails()
returns table (
  id bigint,
  email text,
  created_at timestamptz
)
language sql
security invoker
stable
as $$
  select id, email, created_at
  from public.whitelisted_emails
  order by created_at;
$$;

-- 12. add_whitelisted_email: adds an email
create or replace function public.add_whitelisted_email(p_email text)
returns table (
  id bigint,
  email text,
  created_at timestamptz
)
language sql
security invoker
as $$
  insert into public.whitelisted_emails (email)
  values (lower(p_email))
  returning id, email, created_at;
$$;

-- 13. remove_whitelisted_email: removes email (prevents last one)
create or replace function public.remove_whitelisted_email(p_id bigint)
returns void
language plpgsql
security invoker
as $$
declare
  v_count int;
begin
  select count(*) into v_count from public.whitelisted_emails;

  if v_count <= 1 then
    raise exception 'Cannot remove the last whitelisted email';
  end if;

  delete from public.whitelisted_emails where id = p_id;
end;
$$;
