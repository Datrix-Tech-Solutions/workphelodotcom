-- How applicants should apply for an advert (adverts have no built-in application form).
alter table public.advertiser_jobs
  add column if not exists how_to_apply text;
