"use client";

import { useSyncExternalStore } from "react";
import { savedJobIds, setJobSaved } from "@/app/saved-jobs/actions";
import type { SavedJob } from "@/lib/savedJobs";

// One shared store so every save button on a page agrees, and the ids are
// fetched once rather than once per button.
let ids = new Set<string>();
let loaded = false;
let loading = false;
const listeners = new Set<() => void>();
let snapshot = { ids, loaded };

function emit() {
  snapshot = { ids, loaded };
  listeners.forEach((l) => l());
}

function load() {
  if (loaded || loading) return;
  loading = true;
  savedJobIds()
    .then((list) => {
      ids = new Set(list);
    })
    .catch(() => {})
    .finally(() => {
      loading = false;
      loaded = true;
      emit();
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const serverSnapshot = { ids: new Set<string>(), loaded: false };

export function useSavedJobs() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => serverSnapshot,
  );

  /**
   * Saves or unsaves a job. Resolves "signin" when the visitor isn't signed in
   * as a candidate, so the caller can send them to the sign-in page.
   */
  async function toggle(job: SavedJob): Promise<"ok" | "signin" | "error"> {
    const next = !ids.has(job.id);
    // Optimistic update, rolled back if the server refuses.
    ids = new Set(ids);
    if (next) ids.add(job.id);
    else ids.delete(job.id);
    emit();

    let result: "ok" | "signin" | "error" = "error";
    try {
      result = await setJobSaved(job, next);
    } catch {
      result = "error";
    }
    if (result !== "ok") {
      ids = new Set(ids);
      if (next) ids.delete(job.id);
      else ids.add(job.id);
      emit();
    }
    return result;
  }

  return { ids: state.ids, loaded: state.loaded, toggle };
}

/** Forget cached ids, e.g. after signing out, so the next user starts clean. */
export function resetSavedJobs() {
  ids = new Set();
  loaded = false;
  loading = false;
  emit();
  load();
}
