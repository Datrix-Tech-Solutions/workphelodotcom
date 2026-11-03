"use client";

import { useSyncExternalStore } from "react";
import {
  myJobAlertAction,
  removeJobAlertAction,
  saveJobAlertAction,
} from "@/app/job-alerts/actions";

/**
 * Job alert subscription, for signed-in candidates. The server is the source of
 * truth; this browser keeps a copy in localStorage so the footer can show the
 * right state straight away. It is refreshed (and cleared on sign out) by syncJobAlert.
 */
export type AlertFrequency = "instant" | "daily" | "weekly";

export interface JobAlert {
  /** Where the alerts go. For signed-in users this is their account email. */
  email: string;
  /** Industries to alert on. Empty means every industry. */
  industries: string[];
  frequency: AlertFrequency;
}

export const frequencies: { value: AlertFrequency; label: string; hint: string }[] =
  [
    { value: "instant", label: "As posted", hint: "An email for each new job" },
    { value: "daily", label: "Daily", hint: "One digest each morning" },
    { value: "weekly", label: "Weekly", hint: "One digest every Monday" },
  ];

interface Cached {
  alert: JobAlert;
  token: string;
}

const KEY = "workphelo.jobAlert";
const CHANGE = "workphelo:job-alert-change";

let cachedRaw: string | null | undefined;
let cachedValue: Cached | null = null;

function read(): Cached | null {
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cachedValue = parsed?.alert && parsed?.token ? (parsed as Cached) : null;
  } catch {
    cachedValue = null;
  }
  return cachedValue;
}

function write(value: Cached | null) {
  if (value) localStorage.setItem(KEY, JSON.stringify(value));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(CHANGE));
}

function listen(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Subscribes or updates. Resolves with an error message when it didn't work. */
export async function saveJobAlert(
  choices: Pick<JobAlert, "industries" | "frequency">,
): Promise<string | null> {
  try {
    const result = await saveJobAlertAction(choices);
    if (!result.ok) return result.error;
    write(result.stored);
    return null;
  } catch {
    return "We couldn't save that. Please try again.";
  }
}

export async function removeJobAlert(): Promise<string | null> {
  try {
    const ok = await removeJobAlertAction();
    if (!ok) return "We couldn't unsubscribe you. Please try again.";
    write(null);
    return null;
  } catch {
    return "We couldn't unsubscribe you. Please try again.";
  }
}

/** Refreshes this browser's copy from the server, e.g. after signing in. */
export async function syncJobAlert(): Promise<void> {
  try {
    write(await myJobAlertAction());
  } catch {
    // Offline or the service is down: keep what we have.
  }
}

/** The saved alert, null when not subscribed, undefined before the browser has been read. */
export function useJobAlert(): JobAlert | null | undefined {
  const cached = useSyncExternalStore(listen, read, () => undefined);
  return cached === undefined ? undefined : (cached?.alert ?? null);
}
