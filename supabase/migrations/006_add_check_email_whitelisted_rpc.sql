
create or replace function public.check_email_whitelisted(p_email text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.whitelisted_emails
    where lower(email) = lower(p_email)
  );
end;
$$;

-- Allow anonymous users (pre-auth) to call this function
grant execute on function public.check_email_whitelisted(text) to anon;
grant execute on function public.check_email_whitelisted(text) to authenticated;
