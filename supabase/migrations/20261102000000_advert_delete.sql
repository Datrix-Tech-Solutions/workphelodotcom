-- Advertisers can delete their own adverts. Recruiters' adverts are deleted by the
-- site's server with the service key, after it has checked the recruiter's session.
create policy "Delete own adverts" on public.advertiser_jobs
  for delete using (auth.uid() = user_id);
