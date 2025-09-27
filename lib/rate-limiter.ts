// lib/rate-limiter.ts
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitInfo>;
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(options: { windowMs: number; maxRequests: number }) {
    this.limits = new Map();
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;

    // Set up periodic cleanup to prevent memory leaks
    setInterval(() => {
      this.cleanup();
    }, this.windowMs); // Clean up every window period
  }

  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = identifier;
    const limitInfo = this.limits.get(key);

    if (!limitInfo || now > limitInfo.resetTime) {
      // Reset or initialize the limit
      const resetTime = now + this.windowMs;
      this.limits.set(key, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    // Check if limit is exceeded
    if (limitInfo.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: limitInfo.resetTime,
      };
    }

    // Increment the count
    this.limits.set(key, {
      count: limitInfo.count + 1,
      resetTime: limitInfo.resetTime,
    });

    return {
      allowed: true,
      remaining: this.maxRequests - (limitInfo.count + 1),
      resetTime: limitInfo.resetTime,
    };
  }

  // Cleanup old entries periodically to prevent memory leaks
  cleanup(): void {
    const now = Date.now();
    for (const [key, limitInfo] of this.limits.entries()) {
      if (now > limitInfo.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Rate limiter instances
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
});

export const registerRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 registrations per hour per IP
});

export const resendVerificationRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3, // 3 resend attempts per 15 minutes
});

// Helper function to get client IP
export function getClientIp(req: Request): string {
  // Try different headers that might contain the real client IP
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return xForwardedFor.split(",")[0].trim();
  }

  // For Vercel deployments
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }

  // For Cloudflare
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Default fallback
  return "127.0.0.1";
}
