-- JO FIT AI cost control. Execute once in the Supabase SQL editor.
-- Calls run with the authenticated user's JWT, never a client-supplied user ID.
create table if not exists public.jofit_ai_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null default now(),
  request_count integer not null default 0 check (request_count between 0 and 12)
);
alter table public.jofit_ai_usage enable row level security;
revoke all on public.jofit_ai_usage from public, anon, authenticated;

create or replace function public.jofit_ai_consume_request()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  accepted integer;
begin
  if uid is null then return false; end if;
  insert into public.jofit_ai_usage as u (user_id, window_start, request_count)
  values (uid, now(), 1)
  on conflict (user_id) do update set
    window_start = case when u.window_start <= now() - interval '1 hour' then now() else u.window_start end,
    request_count = case when u.window_start <= now() - interval '1 hour' then 1 else u.request_count + 1 end
  where u.window_start <= now() - interval '1 hour' or u.request_count < 12
  returning request_count into accepted;
  return accepted is not null;
end;
$$;
revoke all on function public.jofit_ai_consume_request() from public, anon;
grant execute on function public.jofit_ai_consume_request() to authenticated;
