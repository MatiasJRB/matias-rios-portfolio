import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LocalEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  clientId: string;
  limit: number;
  scope: string;
  windowMs?: number;
};

const localStores = new Map<string, Map<string, LocalEntry>>();
const distributedLimiters = new Map<string, Ratelimit>();

const hasUpstashConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN,
);

const checkLocalRateLimit = ({
  clientId,
  limit,
  scope,
  windowMs = 60_000,
}: RateLimitOptions) => {
  const now = Date.now();
  const store = localStores.get(scope) ?? new Map<string, LocalEntry>();
  localStores.set(scope, store);

  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) store.delete(key);
  }

  const current = store.get(clientId);
  if (!current || current.resetAt <= now) {
    store.set(clientId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;

  current.count += 1;
  store.set(clientId, current);
  return true;
};

const getDistributedLimiter = (scope: string, limit: number) => {
  const key = `${scope}:${limit}`;
  const existing = distributedLimiters.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, "1 m"),
    prefix: `portfolio:${scope}`,
    analytics: false,
  });
  distributedLimiters.set(key, limiter);
  return limiter;
};

/**
 * Uses Upstash in production when configured so limits are shared by every
 * serverless instance. The in-memory fallback keeps local development simple.
 */
export async function checkRateLimit(options: RateLimitOptions) {
  if (!hasUpstashConfig) return checkLocalRateLimit(options);

  const limiter = getDistributedLimiter(options.scope, options.limit);
  const result = await limiter.limit(options.clientId);
  return result.success;
}
