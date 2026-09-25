import { db as firestoreDb } from '@/lib/firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { DatabaseStore, Prompt, Category, PromptReview, Shortcut } from '@/types';

export const MASTER_STORE_DOC_ID = 'prompthub-master-store';

/**
 * Bilingual English fields (promptTextEn/descriptionEn) are stored OUTSIDE the master
 * store document in system/prompthub-en (keyed by prompt id). This keeps the master
 * doc under Firestore's 1 MiB single-document limit while prompts keep growing.
 */
export const EN_STORE_DOC_ID = 'prompthub-en';

/**
 * Prompt sharding: prompts live in system/prompthub-prompts/shard-0..N instead of the
 * master document. The master document holds categories/shortcuts/settings only, which
 * keeps EVERY written document well under Firestore's 1 MiB limit. Without sharding, the
 * master doc eventually exceeds 1 MiB, Firestore silently rejects the write, and generated
 * prompts/variants never reach the cloud (they "disappear" on other instances).
 */
export const PROMPT_SHARD_COUNT = 8;

function promptShardIndex(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % PROMPT_SHARD_COUNT;
}

const promptShardRef = (n: number) =>
  doc(firestoreDb, 'system', `prompthub-prompts-shard-${n}`);

export function extractEnglishForPrompt(p: Prompt): { promptTextEn?: string; descriptionEn?: string } | null {
  if (!p.promptTextEn && !p.descriptionEn) return null;
  const out: { promptTextEn?: string; descriptionEn?: string } = {};
  if (p.promptTextEn) out.promptTextEn = p.promptTextEn;
  if (p.descriptionEn) out.descriptionEn = p.descriptionEn;
  return out;
}

export function stripEnglishFromPrompt(p: Prompt): Prompt {
  const { promptTextEn, descriptionEn, ...rest } = p as any;
  return rest as Prompt;
}

let cloudSaveTimer: NodeJS.Timeout | null = null;
let cloudFetchQueue: Promise<DatabaseStore | null> | null = null;

/**
 * Union two prompt lists by id, keeping the version with the newer updatedAt/createdAt.
 * Soft-deleted prompts (tombstones with `deleted: true`) are EXCLUDED from the result so
 * that deletions persist across serverless instances while new/edited prompts are preserved.
 */
function unionPrompts(a: Prompt[], b: Prompt[]): Prompt[] {
  const map = new Map<string, Prompt>();
  (a || []).forEach(p => map.set(p.id, p));
  (b || []).forEach(p => {
    const existing = map.get(p.id);
    if (!existing) {
      map.set(p.id, p);
    } else {
      const pTime = new Date(p.updatedAt || p.createdAt || 0).getTime();
      const existTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      if (pTime > existTime) {
        map.set(p.id, {
          ...existing,
          ...p,
          views: Math.max(existing.views || 0, p.views || 0),
          copies: Math.max(existing.copies || 0, p.copies || 0),
          likes: Math.max(existing.likes || 0, p.likes || 0)
        });
      }
    }
  });
  // Exclude soft-deleted tombstones from the merge result
  return Array.from(map.values()).filter(p => !p.deleted);
}

function unionCategories(a: Category[], b: Category[]): Category[] {
  const map = new Map<string, Category>();
  (a || []).forEach(c => map.set(c.id, c));
  (b || []).forEach(c => {
    const existing = map.get(c.id);
    if (!existing) {
      map.set(c.id, c);
    } else {
      const cTime = new Date(c.updatedAt || c.createdAt || 0).getTime();
      const existTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      if (cTime > existTime) {
        map.set(c.id, { ...existing, ...c });
      }
    }
  });
  return Array.from(map.values());
}

function unionReviews(a: PromptReview[], b: PromptReview[]): PromptReview[] {
  const map = new Map<string, PromptReview>();
  (a || []).forEach(r => map.set(r.id, r));
  (b || []).forEach(r => map.has(r.id) || map.set(r.id, r));
  return Array.from(map.values());
}

function unionShortcuts(a: Shortcut[], b: Shortcut[]): Shortcut[] {
  const map = new Map<string, Shortcut>();
  (a || []).forEach(s => map.set(s.id, s));
  (b || []).forEach(s => {
    const existing = map.get(s.id);
    if (!existing) {
      map.set(s.id, s);
    } else {
      const sTime = new Date(s.updatedAt || s.createdAt || 0).getTime();
      const existTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      if (sTime > existTime) {
        map.set(s.id, { ...existing, ...s, copies: Math.max(existing.copies || 0, s.copies || 0) });
      }
    }
  });
  return Array.from(map.values()).filter(s => !s.deleted);
}

/**
 * Persist the entire database store to Firestore Cloud.
 * - Master document (`system/prompthub-master-store`) holds categories, shortcuts, reviews,
 *   settings and counts ONLY — never the prompts array. This keeps it tiny.
 * - Prompts are SHARDED across `system/prompthub-prompts-shard-0..7` (stable hash by id), so
 *   no single document ever approaches Firestore's hard 1 MiB write limit.
 * - Everything is written inside ONE transaction with optimistic union-merging, so concurrent
 *   serverless instances never wipe out each other's newly generated prompts/shortcuts.
 */
export async function persistToCloudFirestore(store: DatabaseStore): Promise<boolean> {
  if (!store || !Array.isArray(store.categories) || !Array.isArray(store.prompts)) {
    return false;
  }

  // Safety check: Never overwrite non-empty cloud data with an empty store
  if (store.categories.length === 0 && store.prompts.length === 0) {
    console.warn('Persist aborted: Prevented saving completely empty database store.');
    return false;
  }

  const docRef = doc(firestoreDb, 'system', MASTER_STORE_DOC_ID);

  try {
    await runTransaction(firestoreDb, async (tx) => {
      const masterSnap = await tx.get(docRef);
      const currentMaster = masterSnap.exists()
        ? (masterSnap.data() as DatabaseStore & { prompts?: Prompt[] })
        : null;

      // Read all prompt shards inside the transaction (atomic read-merge-write).
      const shardRefs = Array.from({ length: PROMPT_SHARD_COUNT }, (_, i) => promptShardRef(i));
      const shardSnaps = await Promise.all(shardRefs.map(ref => tx.get(ref)));
      const shardPrompts = shardSnaps
        .filter(s => s.exists())
        .flatMap(s => ((s.data() as { prompts?: Prompt[] })?.prompts) || []);

      // Migration: if shards are empty but the legacy master doc still carries the prompts
      // array (pre-sharding state), treat that array as the cloud source of truth so the
      // first post-deploy write relocates every prompt into a shard without losing any.
      const legacyMasterPrompts: Prompt[] = Array.isArray(currentMaster?.prompts)
        ? (currentMaster.prompts as Prompt[])
        : [];
      const cloudPrompts = shardPrompts.length > 0 ? shardPrompts : legacyMasterPrompts;

      const merged = {
        categories: unionCategories(currentMaster?.categories || [], store.categories || []),
        prompts: unionPrompts(cloudPrompts, store.prompts || []),
        shortcuts: unionShortcuts(currentMaster?.shortcuts || [], store.shortcuts || []),
        reviews: unionReviews(currentMaster?.reviews || [], store.reviews || [])
      };

      // Split merged prompts into shards by stable id hash.
      const buckets: Prompt[][] = Array.from({ length: PROMPT_SHARD_COUNT }, () => []);
      merged.prompts.forEach(p => {
        buckets[promptShardIndex(p.id)].push(stripEnglishFromPrompt(p));
      });
      shardRefs.forEach((ref, i) => tx.set(ref, { prompts: buckets[i] }));

      // Master doc: no prompts array, so it stays permanently small and writable.
      const payload = {
        categories: merged.categories,
        shortcuts: merged.shortcuts || [],
        reviews: merged.reviews || [],
        blogPosts: store.blogPosts || currentMaster?.blogPosts || [],
        adminSettings: (store.adminSettings || currentMaster?.adminSettings)!,
        adSenseSettings: store.adSenseSettings || currentMaster?.adSenseSettings,
        pixelSettings: store.pixelSettings || currentMaster?.pixelSettings,
        lastSynced: new Date().toISOString(),
        promptsCount: merged.prompts.length,
        categoriesCount: merged.categories.length
      };
      tx.set(docRef, payload);
    });

    await persistEnglishMap(mergedPromptsForEnglish(store));

    return true;
  } catch (err) {
    console.error('Firestore Cloud persist error:', (err as Error)?.message || err);
    return false;
  }
}

function mergedPromptsForEnglish(store: DatabaseStore): Prompt[] {
  return (store.prompts || []).filter(p => !p.deleted && extractEnglishForPrompt(p) !== null);
}

/**
 * Read-merge-write the bilingual English map into system/prompthub-en so the master
 * document never holds bilingual fields (keeps it under Firestore's 1 MiB doc limit).
 */
export async function persistEnglishMap(prompts: Prompt[]): Promise<boolean> {
  const enRef = doc(firestoreDb, 'system', EN_STORE_DOC_ID);
  const enMap: Record<string, { promptTextEn?: string; descriptionEn?: string }> = {};
  for (const p of prompts) {
    const en = extractEnglishForPrompt(p);
    if (en) enMap[p.id] = en;
  }
  if (Object.keys(enMap).length === 0) return true;

  try {
    await runTransaction(firestoreDb, async (tx) => {
      const snap = await tx.get(enRef);
      const current = (snap.exists() && snap.data()?.byPromptId) || {};
      tx.set(enRef, { byPromptId: { ...current, ...enMap }, lastSynced: new Date().toISOString() });
    });
    return true;
  } catch (err) {
    console.error('Firestore English map persist error:', (err as Error)?.message || err);
    return false;
  }
}

export async function fetchEnglishMap(): Promise<Record<string, { promptTextEn?: string; descriptionEn?: string }>> {
  try {
    const enRef = doc(firestoreDb, 'system', EN_STORE_DOC_ID);
    const snap = await getDoc(enRef);
    return (snap.exists() && snap.data()?.byPromptId) || {};
  } catch (err) {
    console.warn('Notice: English map fetch notice:', (err as Error)?.message || err);
    return {};
  }
}

/**
 * Automatically sync updates to Cloud in background with immediate debounce.
 */
export function triggerBackgroundCloudSave(store: DatabaseStore) {
  if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => {
    persistToCloudFirestore(store).catch((e) => {
      console.warn('Cloud autosave warning:', e);
    });
  }, 50);
}

/**
 * Hydrate store from Firestore Cloud. Uses a shared in-flight promise so concurrent
 * callers wait on the same fetch instead of firing duplicate reads.
 */
export async function fetchStoreFromCloud(): Promise<DatabaseStore | null> {
  if (cloudFetchQueue) {
    return cloudFetchQueue;
  }
  cloudFetchQueue = (async () => {
    try {
      const docRef = doc(firestoreDb, 'system', MASTER_STORE_DOC_ID);
      const [masterSnap, ...shardSnaps] = await Promise.all([
        getDoc(docRef),
        ...Array.from({ length: PROMPT_SHARD_COUNT }, (_, i) => getDoc(promptShardRef(i)))
      ]);
      if (!masterSnap.exists()) return null;

      const data = masterSnap.data() as DatabaseStore & { prompts?: Prompt[] };
      if (!data.categories || !Array.isArray(data.categories)) return null;

      // Collect prompts from shards; fall back to the legacy embedded array if a
      // pre-sharding master doc has not been migrated yet.
      const shardPrompts = shardSnaps
        .filter(s => s.exists())
        .flatMap(s => ((s.data() as { prompts?: Prompt[] })?.prompts) || []);
      const prompts = shardPrompts.length > 0 ? shardPrompts : (Array.isArray(data.prompts) ? data.prompts : []);

      const { prompts: _legacyPrompts, ...masterRest } = data as any;

      // Reattach bilingual English fields stored separately in system/prompthub-en.
      const enMap = await fetchEnglishMap();
      const withEn = Object.keys(enMap).length > 0
        ? prompts.map(p => ({ ...p, ...(enMap[p.id] || {}) }))
        : prompts;

      return { ...masterRest, categories: data.categories, prompts: withEn };
    } catch (err) {
      console.warn('Notice: Firestore fetch notice:', (err as Error)?.message || err);
      return null;
    } finally {
      cloudFetchQueue = null;
    }
  })();
  return cloudFetchQueue;
}
