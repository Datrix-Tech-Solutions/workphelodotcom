-- Who posted the advert (the person's own name), shown as "Promoted by" next to the
-- company the advert is for. Older adverts have none.
alter table public.advertiser_jobs
  add column if not exists promoted_by text;
