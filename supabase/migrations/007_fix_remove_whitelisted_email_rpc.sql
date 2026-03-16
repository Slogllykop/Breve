
CREATE OR REPLACE FUNCTION remove_whitelisted_email(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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
