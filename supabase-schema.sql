-- Forma Fitnesscoach 3.0 — optional Supabase backend.
-- Run in Supabase SQL Editor before enabling cloud login from the app.
-- Row-level security ensures every logged-in person can only access their own data.
create table if not exists public.forma_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.forma_user_data enable row level security;

grant select, insert, update, delete on public.forma_user_data to authenticated;

create policy "forma_owner_select" on public.forma_user_data
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "forma_owner_insert" on public.forma_user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "forma_owner_update" on public.forma_user_data
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "forma_owner_delete" on public.forma_user_data
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Automatic update timestamp for all inserts/updates.
create or replace function public.forma_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists forma_set_updated_at on public.forma_user_data;
create trigger forma_set_updated_at
before update on public.forma_user_data
for each row execute function public.forma_set_updated_at();
