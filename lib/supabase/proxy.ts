import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";

/**
 * Refreshes the Supabase auth cookies and reports whether a Supabase account (candidate or advertiser) is signed in.
 * The returned response carries the refreshed cookies.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = supabaseEnv();
  if (!env)
    return { response, isCandidate: false, isAdvertiser: async () => false };

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Must run before any other logic so the session token is refreshed.
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  // Advertisers share the candidates' login; a row in `advertisers` tells them apart.
  const isAdvertiser = async () => {
    if (!user) return false;
    const { data: row } = await supabase
      .from("advertisers")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    return !!row;
  };
  return { response, isCandidate: !!user, isAdvertiser };
}
