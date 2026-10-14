import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** Landing point for Supabase email confirmation links. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only allow same-site relative redirects.
  const next = searchParams.get("next");
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${target}`);
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
