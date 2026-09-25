'use client';

import { useEffect, useState, useCallback } from 'react';
import { Prompt } from '@/types';
import {
  getFavorites,
  isFavorite,
  toggleFavorite,
  getCopyHistory,
  addToCopyHistory,
  clearCopyHistory,
  CopyHistoryItem
} from '@/lib/user-data';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const toggle = useCallback((promptId: string): boolean => {
    const nowFav = toggleFavorite(promptId);
    setFavorites(getFavorites());
    return nowFav;
  }, []);

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  return { favorites, isFav: (id: string) => favorites.includes(id), toggle, refresh };
}

export function useCopyHistory() {
  const [history, setHistory] = useState<CopyHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getCopyHistory());
  }, []);

  const add = useCallback((prompt: Pick<Prompt, 'id' | 'title'>) => {
    addToCopyHistory(prompt);
    setHistory(getCopyHistory());
  }, []);

  const clear = useCallback(() => {
    clearCopyHistory();
    setHistory([]);
  }, []);

  const refresh = useCallback(() => {
    setHistory(getCopyHistory());
  }, []);

  return { history, add, clear, refresh };
}
