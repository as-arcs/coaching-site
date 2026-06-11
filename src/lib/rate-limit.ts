// In-memory sliding window rate limiter.
// Each Vercel function instance has its own store, so limits are per-instance
// (not globally enforced across all concurrent instances). For a low-traffic
// coaching site this is sufficient. Upgrade to @upstash/ratelimit + Redis
// if you ever see coordinated spam across many concurrent requests.
const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  ip: string,
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean } {
  const storeKey = `${key}:${ip}`
  const now = Date.now()
  const entry = store.get(storeKey)

  if (!entry || now > entry.resetAt) {
    store.set(storeKey, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= limit) return { allowed: false }
  entry.count++
  return { allowed: true }
}
