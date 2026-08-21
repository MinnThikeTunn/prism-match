/**
 * In-memory sliding window rate limiter for server routes
 * Prevents API abuse, DoS, and LLM quota exhaustion
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale keys lazily (no global timers: disallowed in Worker global scope)
const CLEANUP_INTERVAL_MS = 300000;
let lastCleanup = 0;

function cleanupStaleKeys(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(
  clientId: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  cleanupStaleKeys(now);
  const existing = rateLimitStore.get(clientId);

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, existing.resetTime - now),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetInMs: Math.max(0, existing.resetTime - now),
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'default-client';
}
