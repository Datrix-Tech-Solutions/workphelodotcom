-- Saved jobs for candidates.
create table if not exists public.saved_jobs (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  job_id     text not null,
  title      text not null,
  company    text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

alter table public.saved_jobs enable row level security;

-- Each candidate can only see and change their own saved jobs.
create policy "Read own saved jobs" on public.saved_jobs
  for select using (auth.uid() = user_id);

create policy "Save own jobs" on public.saved_jobs
  for insert with check (auth.uid() = user_id);

create policy "Unsave own jobs" on public.saved_jobs
  for delete using (auth.uid() = user_id);
