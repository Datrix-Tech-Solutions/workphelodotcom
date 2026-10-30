-- Recruiters can advertise jobs too. They sign in through the HR API, not Supabase,
-- so their adverts are written by the site's server (with the service key, after it
-- has checked the recruiter's session) and tagged with the recruiter's HR user id.
alter table public.advertiser_jobs
  alter column user_id drop not null;

alter table public.advertiser_jobs
  add column if not exists recruiter_id text;

-- Every advert belongs to exactly one owner: an advertiser account or a recruiter.
alter table public.advertiser_jobs
  drop constraint if exists advertiser_jobs_one_owner;
alter table public.advertiser_jobs
  add constraint advertiser_jobs_one_owner
  check ((user_id is not null) <> (recruiter_id is not null));

create index if not exists advertiser_jobs_recruiter_idx
  on public.advertiser_jobs (recruiter_id)
  where recruiter_id is not null;
