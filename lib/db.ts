import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { Category, Prompt, DatabaseStore, PromptReview, Shortcut, DifficultyLevel } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PROMPTS, INITIAL_REVIEWS } from '@/lib/seed-data';
import {
  persistToCloudFirestore,
  triggerBackgroundCloudSave,
  fetchStoreFromCloud
} from '@/lib/firestore-sync';

export { persistToCloudFirestore, triggerBackgroundCloudSave };

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

let hasHydratedFromCloud = false;
let isCloudHydrating = false;
let cloudHydrationPromise: Promise<boolean> | null = null;
let lastHydratedAt = 0;
const HYDRATION_TTL_MS = 10000;

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not create data directory, using memory store:", err);
  }
}

function readLocalDiskStore(): DatabaseStore | null {
  ensureDataDirectory();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      if (fileData && fileData.trim()) {
        const parsed = JSON.parse(fileData) as DatabaseStore;
        if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.prompts)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error("Error reading local database file:", err);
  }
  return null;
}

function writeLocalDiskStore(store: DatabaseStore): boolean {
  try {
    ensureDataDirectory();
    const data = JSON.stringify(store, null, 2);
    fs.writeFileSync(DATA_FILE, data, 'utf-8');
    return true;
  } catch (err) {
    console.error("CRITICAL: Error saving database to disk file:", err);
    return false;
  }
}

/**
 * Smart merge function that prevents losing any locally generated prompts or categories.
 */
function mergeStores(local: DatabaseStore | null, cloud: DatabaseStore | null): DatabaseStore {
  const base = loadInitialStore();

  if (!local && !cloud) return base;

  const catMap = new Map<string, Category>();
  // 1. Seed categories
  base.categories.forEach(c => catMap.set(c.id, c));
  // 2. Cloud categories
  (cloud?.categories || []).forEach(c => catMap.set(c.id, c));
  // 3. Local categories (preserves newly generated or edited categories)
  (local?.categories || []).forEach(c => catMap.set(c.id, c));

  const promptMap = new Map<string, Prompt>();
  // 1. Seed prompts
  base.prompts.forEach(p => promptMap.set(p.id, p));
  // 2. Cloud prompts
  (cloud?.prompts || []).forEach(p => promptMap.set(p.id, p));
  // 3. Local prompts (crucial: any prompt created or generated locally is preserved)
  (local?.prompts || []).forEach(p => {
    const existing = promptMap.get(p.id);
    if (!existing) {
      promptMap.set(p.id, p);
    } else {
      const pTime = new Date(p.updatedAt || p.createdAt || 0).getTime();
      const existTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      if (pTime >= existTime) {
        promptMap.set(p.id, {
          ...existing,
          ...p,
          views: Math.max(existing.views || 0, p.views || 0),
          copies: Math.max(existing.copies || 0, p.copies || 0),
          likes: Math.max(existing.likes || 0, p.likes || 0)
        });
      }
    }
  });
  // 4. Exclude soft-deleted tombstones so deleted prompts stay deleted
  Array.from(promptMap.values()).forEach(p => {
    if (p.deleted) promptMap.delete(p.id);
  });

  // Reviews merge
  const reviewMap = new Map<string, PromptReview>();
  (base.reviews || []).forEach(r => reviewMap.set(r.id, r));
  (cloud?.reviews || []).forEach(r => reviewMap.set(r.id, r));
  (local?.reviews || []).forEach(r => reviewMap.set(r.id, r));

  // Shortcuts merge (union by id, newest updatedAt wins).
  // NO seed/injection here: whatever exists in cloud or local is the source of truth.
  // This guarantees the ~1000+ real shortcuts are never diluted back down to 12 defaults.
  const shortcutMap = new Map<string, Shortcut>();
  (cloud?.shortcuts || []).forEach(s => shortcutMap.set(s.id, s));
  (local?.shortcuts || []).forEach(s => {
    const existing = shortcutMap.get(s.id);
    if (!existing) {
      shortcutMap.set(s.id, s);
    } else {
      const sTime = new Date(s.updatedAt || s.createdAt || 0).getTime();
      const existTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      if (sTime >= existTime) {
        shortcutMap.set(s.id, { ...existing, ...s, copies: Math.max(existing.copies || 0, s.copies || 0) });
      }
    }
  });
  // Soft-delete tombstones are always purged so deletions persist.
  Array.from(shortcutMap.values()).forEach(s => {
    if (s.deleted) shortcutMap.delete(s.id);
  });

  return {
    categories: Array.from(catMap.values()),
    prompts: Array.from(promptMap.values()),
    shortcuts: Array.from(shortcutMap.values()),
    reviews: Array.from(reviewMap.values()),
    adminSettings: local?.adminSettings || cloud?.adminSettings || base.adminSettings,
    adSenseSettings: local?.adSenseSettings || cloud?.adSenseSettings || base.adSenseSettings,
    pixelSettings: local?.pixelSettings || cloud?.pixelSettings || base.pixelSettings
  };
}

// Hydrate store from Firestore Cloud with Smart Merge
export async function hydrateFromCloudFirestore(): Promise<boolean> {
  // If already hydrating, return the existing promise
  if (isCloudHydrating && cloudHydrationPromise) {
    return cloudHydrationPromise;
  }
  isCloudHydrating = true;

  cloudHydrationPromise = (async () => {
    try {
      const localStore = inMemoryStore || readLocalDiskStore();
      const cloudData = await fetchStoreFromCloud();

      if (cloudData && Array.isArray(cloudData.categories) && Array.isArray(cloudData.prompts)) {
        const merged = mergeStores(localStore, cloudData);
        inMemoryStore = merged;
        const diskWritten = writeLocalDiskStore(merged);
        hasHydratedFromCloud = true;
        lastHydratedAt = Date.now();

        // If local store contained data not yet in cloud, push merged state to Cloud
        const cloudPromptsCount = cloudData.prompts.length;
        const cloudShortcutsCount = (cloudData.shortcuts || []).length;
        if (
          merged.prompts.length > cloudPromptsCount ||
          merged.categories.length > cloudData.categories.length ||
          (merged.shortcuts || []).length > cloudShortcutsCount
        ) {
          await persistToCloudFirestore(merged);
        }
        return true;
      } else if (localStore && localStore.prompts && localStore.prompts.length > 0) {
        // No cloud data yet, initialize cloud with our local store (normalized so the
        // seed defaults are included in the very first cloud write instead of being
        // re-injected per-instance from ephemeral disk later).
        const normalized = normalizeStore({ ...localStore, shortcuts: localStore.shortcuts || [] });
        inMemoryStore = normalized;
        writeLocalDiskStore(normalized);
        await persistToCloudFirestore(normalized);
        hasHydratedFromCloud = true;
        lastHydratedAt = Date.now();
        return true;
      } else {
        // Neither cloud nor local has data, use seed defaults
        const initial = loadInitialStore();
        inMemoryStore = initial;
        writeLocalDiskStore(initial);
        hasHydratedFromCloud = true;
        lastHydratedAt = Date.now();
        return true;
      }
    } catch (err) {
      console.warn("Notice: Firestore hydration notice:", (err as Error)?.message || err);
      // Even if cloud fails, try to use local disk store
      if (!inMemoryStore) {
        const diskStore = readLocalDiskStore();
        if (diskStore) {
          inMemoryStore = diskStore;
          hasHydratedFromCloud = true;
          return true;
        }
      }
      return false;
    } finally {
      isCloudHydrating = false;
      cloudHydrationPromise = null;
    }
  })();

  return cloudHydrationPromise;
}

let inMemoryStore: DatabaseStore | null = null;

function loadInitialStore(): DatabaseStore {
  return {
    categories: INITIAL_CATEGORIES,
    prompts: INITIAL_PROMPTS.map(p => ({
      ...p,
      ratingAverage: p.ratingAverage || 4.8,
      ratingCount: p.ratingCount || 12
    })),
    reviews: INITIAL_REVIEWS,
    shortcuts: [],
    blogPosts: [],
    adSenseSettings: {
      enabled: true,
      publisherId: "ca-pub-6559329089674801",
      autoAds: true,
      headerSlot: "8370139912",
      feedSlot: "1475420157",
      modalSlot: "1475420157",
      sidebarSlot: "1000000004",
      stickyBottomSlot: "1000000005",
      testMode: false
    },
    pixelSettings: {
      metaPixelId: "",
      metaPixelEnabled: false,
      ga4MeasurementId: "",
      ga4Enabled: false,
      tiktokPixelId: "",
      tiktokPixelEnabled: false,
      snapchatPixelId: "",
      snapchatPixelEnabled: false,
      twitterPixelId: "",
      twitterPixelEnabled: false,
      pinterestTagId: "",
      pinterestTagEnabled: false,
      linkedInPartnerId: "",
      linkedInEnabled: false,
      customHeadScript: "",
      customBodyScript: ""
    },
    adminSettings: {
      adminUsername: process.env.ADMIN_USERNAME || "wafaa.mohamed.ra@gmail.com",
      adminPasswordHash: process.env.ADMIN_PASSWORD || "Wafaa@2026!",
      siteTitle: "مكتبة البرومبتات الذكية | PromptHub",
      siteDescription: "المرجع العربي الأول لأوامر وبرومبتات الذكاء الاصطناعي المجانية 100%",
      secretAdminPath: "/secret-admin-portal",
      apiKey: process.env.ADMIN_API_KEY || randomBytes(32).toString('hex'),
      lastUpdated: new Date().toISOString()
    }
  };
}

function normalizeStore(store: DatabaseStore): DatabaseStore {
  if (!Array.isArray(store.shortcuts)) {
    store.shortcuts = [];
  }
  if (!Array.isArray(store.blogPosts)) {
    store.blogPosts = [];
  }
  if (!store.adminSettings.apiKey) {
    store.adminSettings.apiKey = process.env.ADMIN_API_KEY || randomBytes(32).toString('hex');
  }
  if (!Array.isArray(store.reviews)) {
    store.reviews = INITIAL_REVIEWS;
  }
  return store;
}

export function getDatabase(): DatabaseStore {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  if (!hasHydratedFromCloud && !isCloudHydrating) {
    // Attempt hydration, but don't block reads - load disk in the meantime
    hydrateFromCloudFirestore().catch(() => {});
  }

  const diskStore = readLocalDiskStore();
  if (diskStore) {
    inMemoryStore = normalizeStore(diskStore);
    return inMemoryStore;
  }

  const initial = loadInitialStore();
  inMemoryStore = initial;
  writeLocalDiskStore(initial);
  return initial;
}

export async function getDatabaseAsync(): Promise<DatabaseStore> {
  // Re-hydrate from cloud when the cached in-memory store is stale. This makes all
  // serverless instances converge to a single cloud truth, eliminating the flicker
  // where different instances returned different (0 / 30 / 60) shortcut counts.
  if (!hasHydratedFromCloud || Date.now() - lastHydratedAt > HYDRATION_TTL_MS) {
    await hydrateFromCloudFirestore();
  }
  // If still not hydrated (e.g., cloud failed and no disk), try disk read
  if (!inMemoryStore) {
    const diskStore = readLocalDiskStore();
    if (diskStore) {
      inMemoryStore = normalizeStore(diskStore);
    } else {
      const initial = loadInitialStore();
      inMemoryStore = initial;
      writeLocalDiskStore(initial);
    }
  }
  return inMemoryStore!;
}

export function saveDatabase(store: DatabaseStore): boolean {
  inMemoryStore = store;
  const diskWritten = writeLocalDiskStore(store);
  triggerBackgroundCloudSave(store);
  return diskWritten && true;
}

// Helper methods for Categories
export function getAllCategories(): Category[] {
  const db = getDatabase();
  return db.categories.map(cat => {
    const count = db.prompts.filter(p => !p.deleted && (p.categoryId === cat.id || p.categorySlug === cat.slug)).length;
    return { ...cat, promptCount: count };
  });
}

export function getCategoryBySlug(slug: string): Category | null {
  const db = getDatabase();
  const cat = db.categories.find(c => c.slug === slug || c.id === slug);
  if (!cat) return null;
  const count = db.prompts.filter(p => !p.deleted && (p.categoryId === cat.id || p.categorySlug === cat.slug)).length;
  return { ...cat, promptCount: count };
}

export function addCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
  const db = getDatabase();
  const id = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = categoryData.slug || categoryData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
  
  const newCat: Category = {
    ...categoryData,
    id,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.categories.push(newCat);
  saveDatabase(db);
  return newCat;
}

export function updateCategory(idOrSlug: string, updates: Partial<Category>): Category | null {
  const db = getDatabase();
  const index = db.categories.findIndex(c => c.id === idOrSlug || c.slug === idOrSlug);
  if (index === -1) return null;

  db.categories[index] = {
    ...db.categories[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // If slug changed, update associated prompts
  if (updates.slug && updates.slug !== db.categories[index].slug) {
    db.prompts = db.prompts.map(p => {
      if (p.categoryId === db.categories[index].id) {
        return { ...p, categorySlug: updates.slug! };
      }
      return p;
    });
  }

  saveDatabase(db);
  return db.categories[index];
}

export function deleteCategory(idOrSlug: string): boolean {
  const db = getDatabase();
  const initialLength = db.categories.length;
  db.categories = db.categories.filter(c => c.id !== idOrSlug && c.slug !== idOrSlug);
  
  if (db.categories.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// Helper methods for Shortcuts
export function getAllShortcuts(search?: string, category?: string): Shortcut[] {
  const db = getDatabase();
  let results = [...(db.shortcuts || [])].filter(s => !s.deleted);
  if (category) {
    const c = category.toLowerCase();
    results = results.filter(s => s.category.toLowerCase().includes(c));
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(s =>
      s.command.toLowerCase().includes(q) ||
      s.slash.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }
  return results.sort((a, b) => b.copies - a.copies);
}

export function getShortcutById(id: string): Shortcut | null {
  const db = getDatabase();
  return (db.shortcuts || []).find(s => s.id === id && !s.deleted) || null;
}

export function addShortcut(data: {
  command: string;
  name: string;
  nameEn?: string;
  description: string;
  category?: string;
  example?: string;
  icon?: string;
}): Shortcut {
  const db = getDatabase();
  const command = data.command.replace(/^\/+/, '').trim();
  const id = `sh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newShortcut: Shortcut = {
    id,
    command,
    slash: `/${command}`,
    name: data.name,
    nameEn: data.nameEn || data.name,
    description: data.description,
    category: data.category || "عام",
    example: data.example,
    icon: data.icon || "Command",
    copies: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (!db.shortcuts) db.shortcuts = [];
  db.shortcuts.push(newShortcut);
  saveDatabase(db);
  return newShortcut;
}

export function updateShortcut(id: string, updates: Partial<Shortcut>): Shortcut | null {
  const db = getDatabase();
  const index = (db.shortcuts || []).findIndex(s => s.id === id);
  if (index === -1) return null;
  db.shortcuts![index] = {
    ...db.shortcuts![index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  return db.shortcuts![index];
}

export function deleteShortcut(id: string): boolean {
  const db = getDatabase();
  const index = (db.shortcuts || []).findIndex(s => s.id === id);
  if (index === -1) return false;
  db.shortcuts![index] = {
    ...db.shortcuts![index],
    deleted: true,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  return true;
}

export function incrementShortcutCopies(id: string): number | null {
  const db = getDatabase();
  const index = (db.shortcuts || []).findIndex(s => s.id === id);
  if (index === -1) return null;
  const updated = (db.shortcuts![index].copies || 0) + 1;
  db.shortcuts![index] = {
    ...db.shortcuts![index],
    copies: updated,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  return updated;
}

export function getShortcutCategories(): string[] {
  const db = getDatabase();
  const set = new Set<string>();
  (db.shortcuts || []).forEach(s => !s.deleted && s.category && set.add(s.category));
  return Array.from(set);
}

// Helper methods for Prompts
export function getAllPrompts(filter?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  model?: string;
  tag?: string;
  difficulty?: string;
  featured?: boolean;
}): Prompt[] {
  const db = getDatabase();
  let results = [...db.prompts].filter(p => !p.deleted);

  if (!filter) return results;

  if (filter.categorySlug && filter.categorySlug !== 'all') {
    const cat = db.categories.find(c => c.slug === filter.categorySlug);
    results = results.filter(p => p.categorySlug === filter.categorySlug || (cat && p.categoryId === cat.id));
  } else if (filter.categoryId && filter.categoryId !== 'all') {
    results = results.filter(p => p.categoryId === filter.categoryId);
  }

  if (filter.model && filter.model !== 'all') {
    const searchModel = filter.model.toLowerCase();
    results = results.filter(p => 
      p.models.some(m => m.toLowerCase().includes(searchModel))
    );
  }

  if (filter.difficulty && filter.difficulty !== 'all') {
    results = results.filter(p => p.difficulty === filter.difficulty);
  }

  if (filter.tag) {
    results = results.filter(p => p.tags.some(t => t.toLowerCase() === filter.tag!.toLowerCase()));
  }

  if (filter.featured !== undefined) {
    results = results.filter(p => p.featured === filter.featured);
  }

  if (filter.search) {
    const q = filter.search.toLowerCase().trim();
    results = results.filter(p => 
      p.title.toLowerCase().includes(q) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      p.promptText.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.models.some(m => m.toLowerCase().includes(q))
    );
  }

  return results;
}

export function getPromptById(idOrSlug: string): Prompt | null {
  const db = getDatabase();
  const found = db.prompts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  return found && !found.deleted ? found : null;
}

export function addPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'copies' | 'likes'>): Prompt {
  const db = getDatabase();
  const id = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = promptData.slug || (promptData.titleEn ? promptData.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `prompt-${Date.now()}`);
  
  // Find category slug if not provided
  let categorySlug = promptData.categorySlug;
  if (!categorySlug && promptData.categoryId) {
    const cat = db.categories.find(c => c.id === promptData.categoryId);
    if (cat) categorySlug = cat.slug;
  }

  const newPrompt: Prompt = {
    ...promptData,
    id,
    slug,
    categorySlug: categorySlug || "general",
    views: 0,
    copies: 0,
    likes: 0,
    ratingAverage: 5.0,
    ratingCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.prompts.unshift(newPrompt);
  saveDatabase(db);
  return newPrompt;
}

export function updatePrompt(id: string, updates: Partial<Prompt>): Prompt | null {
  const db = getDatabase();
  const index = db.prompts.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) return null;

  db.prompts[index] = {
    ...db.prompts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveDatabase(db);
  return db.prompts[index];
}

export function deletePrompt(id: string): boolean {
  const db = getDatabase();
  const prompt = db.prompts.find(p => p.id === id || p.slug === id);
  if (!prompt || prompt.deleted) return false;

  // Soft-delete tombstone so the deletion propagates to Firestore through the
  // union-merge without being resurrected by a concurrent instance's stale copy.
  prompt.deleted = true;
  prompt.updatedAt = new Date().toISOString();

  // Remove associated reviews
  if (db.reviews) {
    db.reviews = db.reviews.filter(r => r.promptId !== prompt.id);
  }
  saveDatabase(db);
  return true;
}

export function incrementPromptStat(id: string, field: 'views' | 'copies' | 'likes', amount: number = 1): Prompt | null {
  const db = getDatabase();
  const prompt = db.prompts.find(p => p.id === id || p.slug === id);
  if (!prompt) return null;

  prompt[field] = (prompt[field] || 0) + amount;
  saveDatabase(db);
  return prompt;
}

// Helper methods for Reviews & Ratings
export function getPromptReviews(promptId: string): PromptReview[] {
  const db = getDatabase();
  const reviews = (db.reviews || []).filter(r => r.promptId === promptId);
  return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllReviews(): PromptReview[] {
  const db = getDatabase();
  return (db.reviews || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addPromptReview(data: {
  promptId: string;
  userName: string;
  rating: number;
  comment: string;
}): { review: PromptReview; prompt: Prompt | null } {
  const db = getDatabase();
  if (!db.reviews) {
    db.reviews = [];
  }

  const prompt = db.prompts.find(p => p.id === data.promptId || p.slug === data.promptId);
  const promptId = prompt ? prompt.id : data.promptId;
  const promptTitle = prompt ? prompt.title : undefined;

  const validRating = Math.max(1, Math.min(5, Math.round(data.rating || 5)));

  const newReview: PromptReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    promptId,
    promptTitle,
    userName: data.userName.trim() || 'مستخدم مميز',
    rating: validRating,
    comment: data.comment.trim(),
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);

  // Recalculate prompt average & count
  if (prompt) {
    const promptReviews = db.reviews.filter(r => r.promptId === prompt.id);
    const sum = promptReviews.reduce((acc, r) => acc + r.rating, 0);
    prompt.ratingCount = promptReviews.length;
    prompt.ratingAverage = Number((sum / promptReviews.length).toFixed(1));
  }

  saveDatabase(db);
  return { review: newReview, prompt: prompt || null };
}

export function deletePromptReview(reviewId: string): boolean {
  const db = getDatabase();
  if (!db.reviews) return false;

  const reviewIndex = db.reviews.findIndex(r => r.id === reviewId);
  if (reviewIndex === -1) return false;

  const targetReview = db.reviews[reviewIndex];
  db.reviews.splice(reviewIndex, 1);

  // Recalculate rating for the prompt
  const prompt = db.prompts.find(p => p.id === targetReview.promptId);
  if (prompt) {
    const remaining = db.reviews.filter(r => r.promptId === prompt.id);
    if (remaining.length > 0) {
      const sum = remaining.reduce((acc, r) => acc + r.rating, 0);
      prompt.ratingCount = remaining.length;
      prompt.ratingAverage = Number((sum / remaining.length).toFixed(1));
    } else {
      prompt.ratingCount = 0;
      prompt.ratingAverage = 5.0;
    }
  }

  saveDatabase(db);
  return true;
}

// Helper methods for AdSense & Pixels
export function getAdSenseSettings(): NonNullable<DatabaseStore['adSenseSettings']> {
  const db = getDatabase();
  const settings = db.adSenseSettings || {
    enabled: true,
    publisherId: "ca-pub-6559329089674801",
    autoAds: true,
    headerSlot: "8370139912",
    feedSlot: "1475420157",
    modalSlot: "1475420157",
    sidebarSlot: "1000000004",
    stickyBottomSlot: "1000000005",
    testMode: false
  };

  // If currently still on placeholder publisherId, update to the user's provided ID
  if (!settings.publisherId || settings.publisherId === "ca-pub-0000000000000000") {
    settings.publisherId = "ca-pub-6559329089674801";
    settings.testMode = false;
    db.adSenseSettings = settings;
    saveDatabase(db);
  }

  return settings;
}

export function updateAdSenseSettings(updates: Partial<NonNullable<DatabaseStore['adSenseSettings']>>) {
  const db = getDatabase();
  db.adSenseSettings = {
    ...getAdSenseSettings(),
    ...updates
  };
  saveDatabase(db);
  return db.adSenseSettings;
}

export function getPixelSettings(): NonNullable<DatabaseStore['pixelSettings']> {
  const db = getDatabase();
  return db.pixelSettings || {
    metaPixelId: "",
    metaPixelEnabled: false,
    ga4MeasurementId: "",
    ga4Enabled: false,
    tiktokPixelId: "",
    tiktokPixelEnabled: false,
    snapchatPixelId: "",
    snapchatPixelEnabled: false,
    twitterPixelId: "",
    twitterPixelEnabled: false,
    pinterestTagId: "",
    pinterestTagEnabled: false,
    linkedInPartnerId: "",
    linkedInEnabled: false,
    customHeadScript: "",
    customBodyScript: ""
  };
}

export function updatePixelSettings(updates: Partial<NonNullable<DatabaseStore['pixelSettings']>>) {
  const db = getDatabase();
  db.pixelSettings = {
    ...getPixelSettings(),
    ...updates
  };
  saveDatabase(db);
  return db.pixelSettings;
}
