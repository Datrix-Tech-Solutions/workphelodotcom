-- A candidate's applications, so the profile can list them. The application
-- itself is submitted to the hr-service; this is only our own record of it.
create table if not exists public.job_applications (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  job_id     text not null,
  title      text not null,
  company    text not null,
  applied_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

alter table public.job_applications enable row level security;

create policy "Read own applications" on public.job_applications
  for select using (auth.uid() = user_id);

create policy "Record own applications" on public.job_applications
  for insert with check (auth.uid() = user_id);
