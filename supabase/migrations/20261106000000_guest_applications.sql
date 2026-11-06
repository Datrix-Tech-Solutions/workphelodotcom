-- Applications made without an account, kept by email until that email signs up or
-- signs in. The profile then moves them into job_applications (see lib/applications.ts).
-- RLS is on with no policies, so only the server (service role) can read or write it.
create table if not exists public.guest_applications (
  email      text not null,
  job_id     text not null,
  title      text not null,
  company    text not null,
  applied_at timestamptz not null default now(),
  primary key (email, job_id),
  constraint guest_applications_email_lowercase check (email = lower(email))
);

alter table public.guest_applications enable row level security;
