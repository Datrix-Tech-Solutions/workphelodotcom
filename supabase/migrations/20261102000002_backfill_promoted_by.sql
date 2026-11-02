-- Fill "Promoted by" on adverts posted before the column existed, using the name the
-- advertiser signed up with (never the company name). Recruiters' adverts have no
-- Supabase account, so they are left empty.
update public.advertiser_jobs j
set promoted_by = a.name
from public.advertisers a
where j.user_id = a.user_id
  and j.promoted_by is null
  and a.name <> '';
