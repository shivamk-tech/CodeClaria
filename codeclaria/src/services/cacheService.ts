// In-memory cache — lives for the lifetime of the server process
// No DB, no Redis — just a Map with TTL

interface CachedRepo {
  files: { path: string; content: string }[];
  lastFetched: number;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes

// Global cache — persists across requests in the same server instance
const repoCache = new Map<string, CachedRepo>();

export function getCachedRepo(repoUrl: string): CachedRepo["files"] | null {
  const cached = repoCache.get(repoUrl);
  if (!cached) return null;
  if (Date.now() - cached.lastFetched > TTL_MS) {
    repoCache.delete(repoUrl);
    return null;
  }
  return cached.files;
}

export function setCachedRepo(repoUrl: string, files: CachedRepo["files"]): void {
  repoCache.set(repoUrl, { files, lastFetched: Date.now() });
}

export function getCacheStats() {
  return { size: repoCache.size, keys: [...repoCache.keys()] };
}
