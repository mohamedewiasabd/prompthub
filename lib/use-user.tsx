'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  getFavorites,
  getCopyHistory,
  setFavorites,
  setHistory,
  subscribeUserData,
  CopyHistoryItem
} from '@/lib/user-data';

interface User {
  id: string;
  email: string;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

function mergeUserData(cloud: { favorites: string[]; history: CopyHistoryItem[] } | null) {
  const localFavs = getFavorites();
  const localHistory = getCopyHistory();

  const favs = Array.from(new Set([...(cloud?.favorites || []), ...localFavs]));
  const historyMap = new Map<string, CopyHistoryItem>();
  [...(cloud?.history || []), ...localHistory].forEach((h) => {
    if (!h || !h.promptId) return;
    const existing = historyMap.get(h.promptId);
    if (!existing) historyMap.set(h.promptId, h);
    else {
      historyMap.set(h.promptId, {
        ...existing,
        ...h,
        copies: Math.max(existing.copies || 0, h.copies || 0),
        copiedAt: new Date(Math.max(new Date(existing.copiedAt || 0).getTime(), new Date(h.copiedAt || 0).getTime())).toISOString()
      });
    }
  });
  const history = Array.from(historyMap.values()).sort(
    (a, b) => new Date(b.copiedAt || 0).getTime() - new Date(a.copiedAt || 0).getTime()
  );

  setFavorites(favs);
  setHistory(history);
  return { favorites: favs, history };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushToServer = useCallback(async () => {
    if (!user) return;
    try {
      await fetch('/api/user-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites: getFavorites(), history: getCopyHistory() })
      });
    } catch {
      // ignore network errors; retry on next change
    }
  }, [user]);

  // Debounced push on local changes
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserData(() => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => pushToServer(), 600);
    });
    return () => {
      unsub();
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [user, pushToServer]);

  // Restore session
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          mergeUserData(data.data || null);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        const merged = mergeUserData(data.data || null);
        setUser(data.user);
        await fetch('/api/user-data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged)
        });
        return null;
      }
      return data.error || 'تعذر تسجيل الدخول';
    } catch {
      return 'تعذر الاتصال بالخادم';
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        const merged = mergeUserData(null);
        setUser(data.user);
        await fetch('/api/user-data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged)
        });
        return null;
      }
      return data.error || 'تعذر إنشاء الحساب';
    } catch {
      return 'تعذر الاتصال بالخادم';
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
