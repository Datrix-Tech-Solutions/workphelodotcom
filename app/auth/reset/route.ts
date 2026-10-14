import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** Landing point for password-reset emails: signs the user in, then sends them to set a new password. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/reset-password`);
  }

  // Expired or already-used link.
  return NextResponse.redirect(`${origin}/forgot-password?expired=1`);
}
