-- Job alert subscriptions from the footer. Visitors don't need an account, so the site's
-- server reads and writes this table with the service key (after checking who is acting);
-- row-level security is on with no policies, so nothing else can touch it.
create table if not exists public.job_alert_subscriptions (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  user_id           uuid references auth.users (id) on delete set null,
  industries        text[] not null default '{}',
  frequency         text not null default 'daily'
                      check (frequency in ('instant', 'daily', 'weekly')),
  -- Proves the holder of an unsubscribe link or this browser owns the subscription.
  token             uuid not null default gen_random_uuid() unique,
  -- Only jobs posted after this are sent, so nothing is sent twice.
  last_sent_at      timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.job_alert_subscriptions enable row level security;

create index if not exists job_alert_subscriptions_frequency_idx
  on public.job_alert_subscriptions (frequency);
