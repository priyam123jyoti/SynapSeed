import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ---------------------------
// Purchase API
// 10 requests / minute / user
// ---------------------------
export const purchaseRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

// ---------------------------
// Upload API
// 5 uploads / hour / user
// ---------------------------
export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
});

// ---------------------------
// Razorpay Order API
// 10 orders / hour / user
// ---------------------------
export const razorpayOrderRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
});

// ---------------------------
// Paper Viewer / Stream
// 120 requests / minute / user
// ---------------------------
export const streamRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, '1 m'),
  analytics: true,
});

// ---------------------------
// Webhook
// 300 requests / minute / IP
// (Allows Razorpay retries while limiting abuse.)
// ---------------------------
export const webhookRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(300, '1 m'),
  analytics: true,
});