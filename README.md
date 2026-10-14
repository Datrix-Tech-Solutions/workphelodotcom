# workphelodotcom
Website for workphelo

## Database (Supabase)

Candidate accounts and saved jobs live in Supabase. Schema changes are SQL files
in `supabase/migrations/`, named `<timestamp>_<description>.sql` and applied in
order. Add a new file for each change; don't edit one that has already been run.

### Environment

Set these in `.env.local` (and in your host's environment settings). See
`.env.example`.

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, or the
  unprefixed `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` if your host refuses
  `NEXT_PUBLIC_` variables. Use the publishable (anon) key, never the
  `service_role` key.

In Supabase → Authentication → URL Configuration, add these redirect URLs
(for both localhost and production):

- `/auth/callback` (email confirmation)
- `/auth/reset` (password reset)

### Applying migrations

**Option A: SQL Editor (no tooling).** In the Supabase dashboard open
**SQL Editor → New query**, paste each file from `supabase/migrations/` in
filename order, and run it.

**Option B: Supabase CLI.** From the project root:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>   # Project Settings → General
npx supabase db push
```

`db push` runs any migrations the remote database hasn't seen yet. Use it
again whenever a new migration file is added.

### Tables

| Table | Purpose |
|---|---|
| `saved_jobs` | Jobs a candidate has saved (row-level security: own rows only) |

A candidate's basic details (name, phone, country, city, role, socials) are
stored on their auth account as user metadata, so they need no table.
