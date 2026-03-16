
-- Fix search_path on all functions to address security advisory

alter function public.is_whitelisted() set search_path = '';
alter function public.handle_updated_at() set search_path = '';
alter function public.check_whitelist(text) set search_path = '';
alter function public.get_all_links() set search_path = '';
alter function public.get_link_by_slug(text) set search_path = '';
alter function public.create_link(text, text, text) set search_path = '';
alter function public.update_link(bigint, text, text, text) set search_path = '';
alter function public.delete_link(bigint) set search_path = '';
alter function public.record_click(bigint, text, text, text) set search_path = '';
alter function public.get_link_analytics(bigint, text) set search_path = '';
alter function public.get_device_analytics(bigint) set search_path = '';
alter function public.get_country_analytics(bigint) set search_path = '';
alter function public.get_whitelisted_emails() set search_path = '';
alter function public.add_whitelisted_email(text) set search_path = '';
alter function public.remove_whitelisted_email(bigint) set search_path = '';
