-- Change SECURITY DEFINER to SECURITY INVOKER for remove_whitelisted_email
CREATE OR REPLACE FUNCTION public.remove_whitelisted_email(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
declare
  v_count int;
begin
  select count(*) into v_count from public.whitelisted_emails;

  if v_count <= 1 then
    raise exception 'Cannot remove the last whitelisted email';
  end if;

  delete from public.whitelisted_emails where email = p_email;
end;
$$;


-- Add SET search_path = '' to check_whitelist
create or replace function public.check_whitelist(p_email text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.whitelisted_emails
    where lower(email) = lower(p_email)
  );
$$;
