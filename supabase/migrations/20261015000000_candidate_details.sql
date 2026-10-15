-- Extra profile details for candidates: education, career and certificates
-- (stored as JSON lists) plus pointers to the uploaded resume / cover letter.
create table if not exists public.candidate_details (
  user_id           uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  education         jsonb not null default '[]'::jsonb,
  career            jsonb not null default '[]'::jsonb,
  certificates      jsonb not null default '[]'::jsonb,
  resume_path       text,
  resume_name       text,
  cover_letter_path text,
  cover_letter_name text,
  updated_at        timestamptz not null default now()
);

alter table public.candidate_details enable row level security;

create policy "Read own details" on public.candidate_details
  for select using (auth.uid() = user_id);

create policy "Create own details" on public.candidate_details
  for insert with check (auth.uid() = user_id);

create policy "Update own details" on public.candidate_details
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Private bucket for resumes and cover letters.
insert into storage.buckets (id, name, public)
values ('candidate-documents', 'candidate-documents', false)
on conflict (id) do nothing;

-- Files live under "<user id>/..."; a candidate can only touch their own folder.
create policy "Read own documents" on storage.objects
  for select using (
    bucket_id = 'candidate-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Upload own documents" on storage.objects
  for insert with check (
    bucket_id = 'candidate-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Replace own documents" on storage.objects
  for update using (
    bucket_id = 'candidate-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Delete own documents" on storage.objects
  for delete using (
    bucket_id = 'candidate-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
