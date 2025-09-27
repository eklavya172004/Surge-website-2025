import { NextResponse } from "next/server";
import { authRateLimiter, getClientIp } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  // Apply rate limiting for auth attempts
  const clientIp = getClientIp(req);
  const rateLimitResult = authRateLimiter.check(clientIp);

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { 
        message: "Too many authentication attempts. Please try again later.",
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        }
      }
    );
  }

  // Return rate limit info to client
  return NextResponse.json({
    allowed: true,
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime,
  });
}

// Add a GET method for checking rate limit status (useful for debugging)
export async function GET(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimitResult = authRateLimiter.check(clientIp);
  
  return NextResponse.json({
    allowed: rateLimitResult.allowed,
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime,
  });
}