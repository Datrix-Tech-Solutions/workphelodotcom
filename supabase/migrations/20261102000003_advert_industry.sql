-- The industry an advert is posted under, used to recommend it to candidates who
-- picked that industry on their profile. Older adverts have none.
alter table public.advertiser_jobs
  add column if not exists industry text;
