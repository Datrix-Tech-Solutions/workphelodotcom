-- Adverts close themselves once their closing date has passed. An advert is still open
-- on its closing date and closed from the next day (UTC).

create extension if not exists pg_cron with schema pg_catalog;

create or replace function public.close_expired_adverts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  closed integer;
begin
  update public.advertiser_jobs
  set status = 'CLOSED'
  where status = 'OPEN'
    and closing_date is not null
    and closing_date < current_date;
  get diagnostics closed = row_count;
  return closed;
end;
$$;

revoke all on function public.close_expired_adverts() from public, anon, authenticated;

-- Shortly after midnight UTC, every day. Scheduling by name replaces any earlier copy.
select cron.schedule(
  'close-expired-adverts',
  '5 0 * * *',
  $$select public.close_expired_adverts()$$
);

-- Catch up on anything already past its date.
select public.close_expired_adverts();

-- Between runs, an expired advert is already hidden from the public.
drop policy if exists "Read open or own adverts" on public.advertiser_jobs;
create policy "Read open or own adverts" on public.advertiser_jobs
  for select using (
    (status = 'OPEN' and (closing_date is null or closing_date >= current_date))
    or auth.uid() = user_id
  );
