import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

/**
 * A Supabase client that bypasses row-level security. Server-only: the key must never
 * reach the browser, and every caller has to check who is acting before using it.
 */
export function isAdminConfigured(): boolean {
  return !!(supabaseEnv() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  const env = supabaseEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !key) throw new Error("Supabase admin access is not configured.");
  return createClient(env.url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
