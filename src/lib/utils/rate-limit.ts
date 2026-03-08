/**
 * In-memory rate limiter using a sliding window.
 *
 * Each "limiter" is a counter per key (IP, email, userId, etc.)
 * that tracks requests within a time window. When the count exceeds
 * the limit, subsequent requests are rejected until the window slides.
 *
 * For production: swap this for @upstash/ratelimit with Redis.
 * The interface stays the same — only the storage backend changes.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp in ms
}

interface RateLimiterConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

// Periodic cleanup to prevent memory leaks in long-running dev server
const CLEANUP_INTERVAL = 60_000; // 1 minute
let cleanupStarted = false;

function startCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    stores.forEach((store) => {
      store.forEach((entry, key) => {
        if (entry.resetAt < now) {
          store.delete(key);
        }
      });
    });
  }, CLEANUP_INTERVAL);
}

export function createRateLimiter(name: string, config: RateLimiterConfig) {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  const store = stores.get(name)!;
  startCleanup();

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(key);

      // No existing entry, or window expired — start fresh
      if (!entry || entry.resetAt < now) {
        store.set(key, {
          count: 1,
          resetAt: now + config.windowSeconds * 1000,
        });
        return {
          allowed: true,
          remaining: config.limit - 1,
          resetAt: now + config.windowSeconds * 1000,
        };
      }

      // Within window — increment
      entry.count += 1;
      if (entry.count > config.limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: entry.resetAt,
        };
      }

      return {
        allowed: true,
        remaining: config.limit - entry.count,
        resetAt: entry.resetAt,
      };
    },
  };
}

// ─── PRE-CONFIGURED LIMITERS ───

/** 100 requests/minute per IP on all API routes */
export const globalLimiter = createRateLimiter("global", {
  limit: 100,
  windowSeconds: 60,
});

/** 5 login attempts/minute per email */
export const loginLimiter = createRateLimiter("login", {
  limit: 5,
  windowSeconds: 60,
});

/** 10 registration attempts/hour per IP */
export const registerLimiter = createRateLimiter("register", {
  limit: 10,
  windowSeconds: 3600,
});

/** 30 step submissions/minute per user */
export const submissionLimiter = createRateLimiter("submission", {
  limit: 30,
  windowSeconds: 60,
});
