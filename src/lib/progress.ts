"use client";

import {
  PROGRESS_STORAGE_KEY,
  UNLOCK_STORAGE_KEY,
} from "./types";

export type ProgressState = {
  studied: string[];
  bookmarked: string[];
};

const empty: ProgressState = { studied: [], bookmarked: [] };

function readRaw(): ProgressState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      studied: Array.isArray(parsed.studied) ? parsed.studied : [],
      bookmarked: Array.isArray(parsed.bookmarked) ? parsed.bookmarked : [],
    };
  } catch {
    return empty;
  }
}

function writeRaw(state: ProgressState) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("travel-chinese-progress"));
}

export function getProgress(): ProgressState {
  return readRaw();
}

export function markStudied(id: string) {
  const state = readRaw();
  if (!state.studied.includes(id)) {
    state.studied.push(id);
    writeRaw(state);
  }
}

export function toggleBookmark(id: string) {
  const state = readRaw();
  if (state.bookmarked.includes(id)) {
    state.bookmarked = state.bookmarked.filter((x) => x !== id);
  } else {
    state.bookmarked.push(id);
  }
  writeRaw(state);
  return state.bookmarked.includes(id);
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(UNLOCK_STORAGE_KEY) === "1";
}

export function setUnlocked(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
  else localStorage.removeItem(UNLOCK_STORAGE_KEY);
  window.dispatchEvent(new Event("travel-chinese-progress"));
}

export function canAccessPhrase(free: boolean): boolean {
  return free || isUnlocked();
}
