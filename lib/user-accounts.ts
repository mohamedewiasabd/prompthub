import crypto from 'crypto';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db as firestoreDb } from '@/lib/firebase';
import { CopyHistoryItem } from '@/lib/user-data';

const USER_SECRET = process.env.USER_SESSION_SECRET || 'prompthub-user-session-secret-2026';
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface UserAccount {
  id: string;
  email: string;
  passHash: string;
  salt: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserData {
  favorites: string[];
  history: CopyHistoryItem[];
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function makeUserToken(userId: string): string {
  const payload = {
    sub: userId,
    exp: Date.now() + TOKEN_MAX_AGE,
    nonce: crypto.randomBytes(8).toString('hex')
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', USER_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyUserToken(token: string): string | null {
  if (!token) return null;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  const expected = crypto.createHmac('sha256', USER_SECRET).update(data).digest('base64url');
  if (signature !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (!payload.sub || !payload.exp || Date.now() > payload.exp) return null;
    return String(payload.sub);
  } catch {
    return null;
  }
}

function sanitizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

function userRef(userId: string) {
  return doc(firestoreDb, 'system', `account-${userId}`);
}

function dataRef(userId: string) {
  return doc(firestoreDb, 'system', `userdata-${userId}`);
}

export async function findUserByEmail(email: string): Promise<UserAccount | null> {
  const clean = sanitizeEmail(email);
  if (!clean) return null;
  const snap = await getDoc(userRef(clean));
  if (!snap.exists()) return null;
  return snap.data() as UserAccount;
}

export async function getUserById(userId: string): Promise<UserAccount | null> {
  if (!userId) return null;
  const snap = await getDoc(userRef(userId));
  if (!snap.exists()) return null;
  return snap.data() as UserAccount;
}

export async function registerUser(email: string, password: string): Promise<{ user: UserAccount; token: string } | { error: string }> {
  const clean = sanitizeEmail(email);
  if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { error: 'يرجى إدخال بريد إلكتروني صالح' };
  }
  if (!password || password.length < 6) {
    return { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }
  const existing = await findUserByEmail(clean);
  if (existing) {
    return { error: 'هذا البريد مسجّل بالفعل. حاول تسجيل الدخول.' };
  }
  const id = clean;
  const salt = crypto.randomBytes(16).toString('hex');
  const user: UserAccount = {
    id,
    email: clean,
    passHash: hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  await setDoc(userRef(id), user);
  return { user, token: makeUserToken(id) };
}

export async function loginUser(email: string, password: string): Promise<{ user: UserAccount; token: string } | { error: string }> {
  const clean = sanitizeEmail(email);
  const user = await findUserByEmail(clean);
  if (!user) {
    return { error: 'البريد أو كلمة المرور غير صحيحة' };
  }
  const attemptedHash = hashPassword(password || '', user.salt);
  if (attemptedHash !== user.passHash) {
    return { error: 'البريد أو كلمة المرور غير صحيحة' };
  }
  await setDoc(userRef(user.id), { ...user, lastLogin: new Date().toISOString() }, { merge: true });
  return { user, token: makeUserToken(user.id) };
}

export async function getUserData(userId: string): Promise<UserData | null> {
  if (!userId) return null;
  try {
    const snap = await getDoc(dataRef(userId));
    if (!snap.exists()) return null;
    const d = snap.data() as Partial<UserData>;
    return {
      favorites: Array.isArray(d.favorites) ? d.favorites : [],
      history: Array.isArray(d.history) ? d.history : [],
      updatedAt: d.updatedAt || new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export async function saveUserData(userId: string, data: UserData): Promise<boolean> {
  if (!userId) return false;
  try {
    await setDoc(
      dataRef(userId),
      {
        favorites: Array.isArray(data.favorites) ? data.favorites : [],
        history: Array.isArray(data.history) ? data.history : [],
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch {
    return false;
  }
}
