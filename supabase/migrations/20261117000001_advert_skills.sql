-- Skills an advert asks applicants for.
alter table public.advertiser_jobs
  add column if not exists skills text[] not null default '{}';
