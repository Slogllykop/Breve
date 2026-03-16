CREATE OR REPLACE FUNCTION public.get_link_analytics(p_link_id bigint, p_period text DEFAULT '30d'::text)
 RETURNS TABLE(date text, click_count bigint)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare
  v_interval interval;
  v_trunc text;
begin
  case p_period
    when '7d' then
      v_interval := interval '7 days';
      v_trunc := 'day';
    when '30d' then
      v_interval := interval '30 days';
      v_trunc := 'day';
    when '90d' then
      v_interval := interval '90 days';
      v_trunc := 'day';
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
$function$
