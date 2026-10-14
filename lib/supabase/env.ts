/**
 * Newer Supabase projects call the public key "publishable"; older ones "anon".
 * Supabase is only used on the server, so the unprefixed names work too; use
 * those when a host refuses `NEXT_PUBLIC_` variables.
 */
export function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}
