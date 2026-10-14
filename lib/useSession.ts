"use client";

import { useCallback, useEffect, useState } from "react";
import { currentSession } from "@/app/auth/actions";
import { SESSION_CHANGE_EVENT } from "@/lib/auth/constants";
import type { Session } from "@/lib/auth/types";

/** Call after signing in or out so every useSession() re-reads the session. */
export function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/** The signed-in session (from the server), or null. `undefined` while loading. */
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  const load = useCallback(() => {
    currentSession()
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(SESSION_CHANGE_EVENT, load);
    return () => window.removeEventListener(SESSION_CHANGE_EVENT, load);
  }, [load]);

  return session;
}
