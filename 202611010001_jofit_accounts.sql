-- JO FIT 5: account-owned JSON state, optimistic concurrency and RLS.
-- Apply in Supabase SQL Editor. This does not delete existing forma_user_data.
create table if not exists public.jofit_user_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{}'::jsonb,
 version integer not null default 1 check (version>=1),
 updated_at timestamptz not null default now()
);
alter table public.jofit_user_state enable row level security;
revoke all on public.jofit_user_state from anon, authenticated;
grant select,insert,update,delete on public.jofit_user_state to authenticated;
drop policy if exists jo_state_select on public.jofit_user_state;
drop policy if exists jo_state_insert on public.jofit_user_state;
drop policy if exists jo_state_update on public.jofit_user_state;
drop policy if exists jo_state_delete on public.jofit_user_state;
create policy jo_state_select on public.jofit_user_state for select to authenticated using ((select auth.uid())=user_id);
create policy jo_state_insert on public.jofit_user_state for insert to authenticated with check ((select auth.uid())=user_id);
create policy jo_state_update on public.jofit_user_state for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy jo_state_delete on public.jofit_user_state for delete to authenticated using ((select auth.uid())=user_id);

create or replace function public.jofit_save_state(expected_version integer, payload jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare v_uid uuid; v_version integer;
begin
 v_uid := (select auth.uid());
 if v_uid is null then raise exception 'Not authenticated' using errcode='28000'; end if;
 if expected_version is null or expected_version<0 or payload is null or jsonb_typeof(payload)<>'object'
    or octet_length(payload::text)>900000 then raise exception 'Invalid data or version'; end if;
 if expected_version=0 then
   insert into public.jofit_user_state(user_id,data,version)
     values(v_uid,payload,1) on conflict (user_id) do nothing returning version into v_version;
 else
   update public.jofit_user_state set data=payload,version=version+1,updated_at=now()
      where user_id=v_uid and version=expected_version returning version into v_version;
 end if;
 if v_version is null then
   select version into v_version from public.jofit_user_state where user_id=v_uid;
   return jsonb_build_object('status','conflict','version',v_version);
 end if;
 return jsonb_build_object('status','ok','version',v_version);
end $$;
revoke execute on function public.jofit_save_state(integer,jsonb) from public,anon;
grant execute on function public.jofit_save_state(integer,jsonb) to authenticated;

-- Server quota. Only authenticated caller may consume its own allowance.
create table if not exists public.jofit_api_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 day date not null default current_date,
 kind text not null check(kind in ('coach','food')),
 requests integer not null default 0,
 primary key(user_id,day,kind)
);
alter table public.jofit_api_usage enable row level security;
revoke all on public.jofit_api_usage from anon,authenticated;
create or replace function public.jofit_claim_request(p_kind text,p_daily_limit integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_count integer;
begin
 v_uid := (select auth.uid());
 if v_uid is null or p_kind not in ('coach','food') or p_daily_limit<1 then return false; end if;
 insert into public.jofit_api_usage(user_id,day,kind,requests)
 values(v_uid,current_date,p_kind,1)
 on conflict(user_id,day,kind) do update set requests=public.jofit_api_usage.requests+1
 where public.jofit_api_usage.requests < least(p_daily_limit,case when p_kind='coach' then 10 else 40 end)
 returning requests into v_count;
 return v_count is not null;
end $$;
revoke execute on function public.jofit_claim_request(text,integer) from public,anon;
grant execute on function public.jofit_claim_request(text,integer) to authenticated;

-- Protect Open Food Facts from bursts caused by all JO FIT users behind one edge IP.
create table if not exists public.jofit_off_global_window (
 minute_bucket timestamptz primary key,
 requests integer not null default 0
);
alter table public.jofit_off_global_window enable row level security;
revoke all on public.jofit_off_global_window from anon,authenticated;
create or replace function public.jofit_claim_off_global()
returns boolean language plpgsql security definer set search_path = '' as $$
declare bucket timestamptz; count_now integer;
begin
 if (select auth.uid()) is null then return false; end if;
 bucket:=date_trunc('minute',clock_timestamp());
 insert into public.jofit_off_global_window(minute_bucket,requests) values(bucket,1)
 on conflict(minute_bucket) do update set requests=public.jofit_off_global_window.requests+1
 where public.jofit_off_global_window.requests<8 returning requests into count_now;
 return count_now is not null;
end $$;
revoke execute on function public.jofit_claim_off_global() from public,anon;
grant execute on function public.jofit_claim_off_global() to authenticated;
