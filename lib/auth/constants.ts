/** Recruiter session: the API's tokens, kept in this site's own httpOnly cookies. */
export const RECRUITER_ACCESS_COOKIE = "workphelo-recruiter-access";
export const RECRUITER_REFRESH_COOKIE = "workphelo-recruiter-refresh";
/** Display details only (name, company); the API still checks the token on every request. */
export const RECRUITER_USER_COOKIE = "workphelo-recruiter-user";

export const RECRUITER_ACCESS_MAX_AGE = 15 * 60;
export const RECRUITER_REFRESH_MAX_AGE = 8 * 60 * 60;

/** Fired in the browser after sign in / sign out so the UI re-reads the session. */
export const SESSION_CHANGE_EVENT = "workphelo:session-change";
