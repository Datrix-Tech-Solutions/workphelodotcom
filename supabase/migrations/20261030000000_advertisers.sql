-- Advertisers: accounts that advertise jobs, and the jobs they advertise.
-- They sign in through Supabase Auth like candidates; a row in `advertisers`
-- is the tag that tells the two apart.
create table if not exists public.advertisers (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '',
  created_at timestamptz not null default now()
);

alter table public.advertisers enable row level security;

create policy "Read own advertiser" on public.advertisers
  for select using (auth.uid() = user_id);

-- The row is created at sign-up, before the email is confirmed and a session
-- exists, so a trigger does it rather than the client.
create or replace function public.handle_new_advertiser()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data ->> 'account_type' = 'advertiser' then
    insert into public.advertisers (user_id, name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_advertiser on auth.users;
create trigger on_auth_user_created_advertiser
  after insert on auth.users
  for each row execute function public.handle_new_advertiser();

create table if not exists public.advertiser_jobs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references public.advertisers (user_id) on delete cascade,
  advertiser_name   text not null default '',
  title             text not null,
  location          text not null,
  city              text,
  job_type          text not null check (job_type in ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
  work_mode         text check (work_mode in ('ONSITE', 'REMOTE', 'HYBRID')),
  vacancies         integer,
  closing_date      date,
  description       text not null,
  responsibilities  text,
  requirements      text,
  perks_and_benefits text,
  salary_type       text not null default 'NON_DISCLOSED' check (salary_type in ('NON_DISCLOSED', 'FIXED', 'RANGE')),
  salary_amount     numeric,
  salary_min        numeric,
  salary_max        numeric,
  salary_currency   text,
  status            text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  created_at        timestamptz not null default now()
);

create index if not exists advertiser_jobs_status_created_idx
  on public.advertiser_jobs (status, created_at desc);

alter table public.advertiser_jobs enable row level security;

-- Open adverts are public, so the job board can list them; an advertiser also
-- sees their own closed ones.
create policy "Read open or own adverts" on public.advertiser_jobs
  for select using (status = 'OPEN' or auth.uid() = user_id);

create policy "Post own adverts" on public.advertiser_jobs
  for insert with check (auth.uid() = user_id);

create policy "Update own adverts" on public.advertiser_jobs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
