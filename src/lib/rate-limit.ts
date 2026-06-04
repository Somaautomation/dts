import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let inMemoryStore: Map<string, { count: number; resetAt: number }> = new Map();

function isUsableEnvValue(value: string | undefined) {
  return Boolean(value && value.trim() && !value.startsWith('PASTE_'));
}

function isValidRedisRestUrl(url: string | undefined) {
  return isUsableEnvValue(url) && url!.startsWith('https://');
}

function getRedis(): Redis | null {
  if (redis) return redis;
  if (isValidRedisRestUrl(process.env.UPSTASH_REDIS_REST_URL) && isUsableEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN)) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  }
  return null;
}

export function createRateLimiter(prefix: string, max: number, windowSec: number) {
  const r = getRedis();
  if (r) {
    return new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      analytics: true,
      prefix,
    });
  }
  // In-memory fallback (dev only)
  return {
    async limit(key: string) {
      const now = Date.now();
      const fullKey = `${prefix}:${key}`;
      const entry = inMemoryStore.get(fullKey);
      if (!entry || entry.resetAt < now) {
        inMemoryStore.set(fullKey, { count: 1, resetAt: now + windowSec * 1000 });
        return { success: true, limit: max, remaining: max - 1, reset: now + windowSec * 1000 };
      }
      entry.count += 1;
      return { success: entry.count <= max, limit: max, remaining: Math.max(0, max - entry.count), reset: entry.resetAt };
    },
  };
}

export const otpRateLimiter = createRateLimiter('otp', 3, 60); // 3 requests / minute
export const apiRateLimiter = createRateLimiter('api', 60, 60); // 60 requests / minute
