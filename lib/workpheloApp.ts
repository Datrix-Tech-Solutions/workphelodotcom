import { API_URL } from "@/lib/api";
import type { AuthUser } from "@/lib/auth/types";

const DEV_APP_URL = "https://dev-app.workphelo.com";
const PRODUCTION_APP_URL = "https://app.workphelo.com";

// WORKPHELO_APP_URL wins. Otherwise the app matches whichever API this site talks to,
// so a dev deployment never sends recruiters to the production app.
export const APP_URL =
  process.env.WORKPHELO_APP_URL ??
  (API_URL.includes("dev-api") ? DEV_APP_URL : PRODUCTION_APP_URL);

/**
 * Where "View on Workphelo" goes: the company's login page in the app when it is
 * on WorkPhelo, otherwise the pricing page.
 */
export function workpheloAppLink(user: AuthUser): {
  href: string;
  external: boolean;
} {
  if (user.companyVerified && user.tenantSlug) {
    return {
      href: `${APP_URL}/${encodeURIComponent(user.tenantSlug)}/login`,
      external: true,
    };
  }
  return { href: "/pricing", external: false };
}
