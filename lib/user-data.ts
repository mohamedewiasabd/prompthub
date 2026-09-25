'use client';

import { Prompt } from '@/types';

const FAVORITES_KEY = 'ph_favorites';
const COPY_HISTORY_KEY = 'ph_copy_history';
const MAX_HISTORY = 50;

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeUserData(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {
      // ignore
    }
  });
}

export function setFavorites(favs: string[]) {
  safeSet(FAVORITES_KEY, favs);
  notify();
}

export function setHistory(history: CopyHistoryItem[]) {
  safeSet(COPY_HISTORY_KEY, history);
  notify();
}

export interface CopyHistoryItem {
  promptId: string;
  title: string;
  copies: number;
  copiedAt: string;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota/private mode errors
  }
}

export function getFavorites(): string[] {
  return safeGet<string[]>(FAVORITES_KEY, []);
}

export function isFavorite(promptId: string): boolean {
  return getFavorites().includes(promptId);
}

export function toggleFavorite(promptId: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(promptId);
  let nowFav = false;
  if (idx === -1) {
    favs.push(promptId);
    nowFav = true;
  } else {
    favs.splice(idx, 1);
  }
  safeSet(FAVORITES_KEY, favs);
  notify();
  return nowFav;
}

export function removeFavorite(promptId: string) {
  const favs = getFavorites().filter(id => id !== promptId);
  safeSet(FAVORITES_KEY, favs);
  notify();
}

export function getCopyHistory(): CopyHistoryItem[] {
  return safeGet<CopyHistoryItem[]>(COPY_HISTORY_KEY, []);
}

export function addToCopyHistory(prompt: Pick<Prompt, 'id' | 'title'>) {
  const history = getCopyHistory();
  const existing = history.find(h => h.promptId === prompt.id);
  if (existing) {
    existing.copies += 1;
    existing.copiedAt = new Date().toISOString();
  } else {
    history.unshift({
      promptId: prompt.id,
      title: prompt.title,
      copies: 1,
      copiedAt: new Date().toISOString()
    });
  }
  // Keep most recent first, cap at MAX_HISTORY
  const filtered = history
    .sort((a, b) => new Date(b.copiedAt).getTime() - new Date(a.copiedAt).getTime())
    .slice(0, MAX_HISTORY);
  safeSet(COPY_HISTORY_KEY, filtered);
  notify();
}

export function clearCopyHistory() {
  safeSet(COPY_HISTORY_KEY, []);
  notify();
}
