import type { Request } from 'express';

// Fast in-process cache (replacement for Redis).
// NOTE: This cache is process-local; different server instances won't share cached data.

type CacheEntry = {
  value: unknown;
  expiresAt: number; // epoch ms
};

const MAX_ENTRIES = process.env.CACHE_MAX_ENTRIES ? Number(process.env.CACHE_MAX_ENTRIES) : 50_000;
const DEFAULT_TTL_SECONDS = process.env.CACHE_DEFAULT_TTL_SECONDS ? Number(process.env.CACHE_DEFAULT_TTL_SECONDS) : 60;

const store = new Map<string, CacheEntry>();

// Simple eviction: if over max, remove oldest half by insertion order.
const ensureCapacity = () => {
  if (store.size <= MAX_ENTRIES) return;
  const targetSize = Math.max(Math.floor(MAX_ENTRIES * 0.5), 1);
  const keysToDelete = Array.from(store.keys()).slice(0, store.size - targetSize);
  for (const k of keysToDelete) store.delete(k);
};

const now = () => Date.now();

const getEntryIfFresh = (key: string): unknown | null => {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now()) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

// Keep existing exports compatible with previous Redis version.
export const getRedis = () => null;


export const cacheKeyFromReq = (req: Request) => {
  const q = JSON.stringify(req.query || {});
  return `cache:${req.originalUrl}:${q}`;
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    return getEntryIfFresh(key) as T | null;
  } catch {
    return null;
  }
};

export const setCache = async (key: string, value: unknown, ttlSeconds: number) => {
  try {
    const ttl = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : DEFAULT_TTL_SECONDS;
    ensureCapacity();
    store.set(key, { value, expiresAt: now() + ttl * 1000 });
  } catch {
    // ignore cache errors
  }
};

export const clearCacheByPrefix = async (prefix: string) => {
  try {
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) store.delete(key);
    }
  } catch {
    // ignore
  }
};


