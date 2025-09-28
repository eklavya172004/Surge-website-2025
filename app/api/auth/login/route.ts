import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { authRateLimiter, getClientIp } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  // Apply rate limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = authRateLimiter.check(clientIp);

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { message: "Too many authentication attempts. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        }
      }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    // Use NextAuth's internal sign in
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      // If authentication failed, return error but don't update rate limit
      // (we want to rate limit based on attempts, successful or not)
      return NextResponse.json(
        { error: res.error },
        { status: 401 }
      );
    }

    // If successful, return success response
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}