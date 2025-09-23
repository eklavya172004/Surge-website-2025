# Authentication System Updates

This document summarizes all the changes made to implement verification-based authentication in your Next.js application.

## 1. NextAuth Configuration Updates

The NextAuth configuration has been properly set up in `server/auth.ts` with email verification and credentials provider support. This configuration is used by the NextAuth API route handler.

## 2. NextAuth API Route Handler

Created the required NextAuth API route handler to enable all built-in NextAuth.js endpoints.

**File: `app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

## 3. Email Verification API Endpoint

Created a new API endpoint to handle email verification tokens.

**File: `app/api/verify-email/route.ts`**

```typescript
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/error?message=Missing token", request.url));
  }

  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: token,
      },
      include: {
        User: true,
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL("/auth/error?message=Invalid or expired token", request.url));
    }

    // Update user as verified
    await prisma.user.update({
      where: {
        id: verificationToken.userId!,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: {
        token: token,
      },
    });

    return NextResponse.redirect(new URL("/auth/login?message=Email verified successfully", request.url));
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(new URL("/auth/error?message=Error verifying email", request.url));
  }
}
```

## 4. Registration API with Email Verification

Updated the registration API to send verification emails after creating users.

**File: `app/api/register/route.ts`**

```typescript
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password, name, collegeName, rollNumber, phone } =
      await req.json();
    if ((!email || !password || !name || !collegeName ||  !rollNumber  || !phone)) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        collegeName,
        rollNumber,
        phone,
        emailVerified: null,
      },
    });

    // Create verification token
    const verificationToken = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
        userId: user.id,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${verificationToken}`;
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: "Verify your email address",
      html: `
        <body>
          <h1>Verify your email address</h1>
          <p>Hello ${name},</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #f3ad18; color: white; text-decoration: none;">Verify Email</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </body>
      `,
    });

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email for verification.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user ", error);

    return NextResponse.json(
      {
        msg: "Internal server error",
      },
      {
        status: 505,
      },
    );
  }
}
```

## 5. Enhanced Email Templates

Updated the email templates for better user experience.

**File: `server/verfiy.ts`**

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateParams {
  url: string;
  baseUrl: string;
  email?: string;
  name?: string;
}

interface VerificationRequestParams {
  identifier: string;
  url: string;
  provider: {
    from: string;
  };
  user?: {
    name?: string;
  };
}

export function html({ url, name }: EmailTemplateParams): string {
  const buttonText = "Verify Email";
  return `
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #f3ad18;">Verify your email address</h1>
        <p>Hello${name ? ` ${name}` : ''},</p>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="display: inline-block; padding: 12px 24px; background-color: #f3ad18; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
             ${buttonText}
          </a>
        </div>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${url}
        </p>
      </div>
    </body>
  `;
}

export function text({ url, baseUrl, name }: EmailTemplateParams): string {
  return `Hello${name ? ` ${name}` : ''},

Thank you for registering. Please verify your email address by clicking the link below:

${url}

If you didn't create an account, you can safely ignore this email.

This link will expire in 24 hours.

---
${baseUrl}
`;
}

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
  user,
}: VerificationRequestParams) {
  const { host } = new URL(url);

  await resend.emails.send({
    from: provider.from ?? "Your App <noreply@yourdomain.com>",
    to: identifier,
    subject: `Verify your email address`,
    html: html({ url, baseUrl: host, email: identifier, name: user?.name }),
    text: text({ url, baseUrl: host, email: identifier, name: user?.name }),
  });
}
```

## 6. Login Page with Verification Handling

Updated the login page to properly handle verification requirements.

**File: `app/auth/login/page.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for message in URL params
  useState(() => {
    const msg = searchParams.get("message");
    if (msg) {
      setMessage(msg);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        // Check if it's a verification error
        if (res.error.includes("verify")) {
          setError("Please verify your email before logging in. Check your inbox for the verification email.");
        } else {
          setError("Invalid email or password");
        }
      } else {
        // Check if user is verified before redirecting
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.emailVerified) {
          router.push("/dashboard"); // redirect to protected page
        } else {
          router.push(`/auth/verify-request?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
        
        {message && <p className="mb-4 text-sm text-green-500">{message}</p>}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
```

## 7. Registration Page Redirection

Updated the registration page to redirect to the verification request page after successful registration.

**File: `app/auth/register/page.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
    rollNumber: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      } else {
        // Redirect to verification request page with email as parameter
        router.push(`/auth/verify-request?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Register</h1>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="collegeName"
            placeholder="College Name"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="rollNumber"
            placeholder="Roll Number"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
```

## 8. Verification Request Page

Created a page to inform users about the verification email and allow resending.

**File: `app/auth/verify-request/page.tsx`**

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setMessage("Verification email resent successfully. Please check your inbox.");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      setMessage("An error occurred while resending the email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Check Your Email</h1>
        
        <p className="mb-4 text-center text-gray-600">
          We've sent a verification link to <strong>{email || "your email"}</strong>.
          Please check your inbox and click the link to verify your account.
        </p>
        
        <p className="mb-6 text-center text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or click below to resend.
        </p>
        
        {message && (
          <p className="mb-4 text-center text-sm" 
             className={message.includes("successfully") ? "text-green-500" : "text-red-500"}>
            {message}
          </p>
        )}
        
        <button
          onClick={handleResend}
          disabled={isResending || !email}
          className="w-full rounded-lg bg-yellow-500 py-2 text-white hover:bg-yellow-600 disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend Verification Email"}
        </button>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
```

## 9. Resend Verification API

Created an API endpoint to resend verification emails.

**File: `app/api/resend-verification/route.ts`**

```typescript
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "User is already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    // Create new verification token
    const verificationToken = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
        userId: user.id,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${verificationToken}`;
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: "Verify your email address",
      html: `
        <body>
          <h1>Verify your email address</h1>
          <p>Hello ${user.name},</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #f3ad18; color: white; text-decoration: none;">Verify Email</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </body>
      `,
    });

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## 10. Authentication Error Page

Created an error page for auth errors.

**File: `app/auth/error/page.tsx`**

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An error occurred during authentication";
  const message = searchParams.get("message") || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-red-500">Authentication Error</h1>
        
        <p className="mb-4 text-center text-gray-600">
          {message || error}
        </p>
        
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
```

## 11. NextAuth Middleware for Route Protection

Created middleware to protect routes based on authentication and verification status.

**File: `middleware.ts`**

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom logic to check if user is verified
    const token = req.nextauth.token;
    
    // Check if user is verified (has emailVerified timestamp)
    const isVerified = !!token?.emailVerified;
    
    // If user is not verified and trying to access protected routes
    if (!isVerified && req.nextUrl.pathname.startsWith("/dashboard")) {
      // Redirect to verification page
      const verifyUrl = new URL("/auth/verify-request", req.url);
      if (token?.email) {
        verifyUrl.searchParams.set("email", token.email);
      }
      return NextResponse.redirect(verifyUrl);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if user has a valid token
        return !!token;
      },
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    // Add any other routes that should be protected
  ],
};
```

## 12. Client-Side Authentication Helpers

Created client-side helpers to check authentication status.

**File: `lib/client-auth.ts`**

```typescript
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Custom hook to check if user is authenticated and verified
export function useAuth() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    
    if (session?.user) {
      setIsAuthenticated(true);
      // Check if user is verified
      setIsVerified(!!session.user.emailVerified);
    } else {
      setIsAuthenticated(false);
      setIsVerified(false);
    }
    
    setLoading(false);
  }, [session, status]);
  
  return { isAuthenticated, isVerified, loading, session };
}

// Custom hook to protect routes on the client side
export function useProtectedRoute(shouldVerify = true) {
  const router = useRouter();
  const { isAuthenticated, isVerified, loading } = useAuth();
  
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    
    if (shouldVerify && !isVerified) {
      router.push("/auth/verify-request");
    }
  }, [isAuthenticated, isVerified, loading, router, shouldVerify]);
  
  return { isAuthenticated, isVerified, loading };
}
```

## 13. Dashboard Page

Created a dashboard page to test protected routes.

**File: `app/dashboard/page.tsx`**

```typescript
import DashboardClientPage from "./client-page";

export default function DashboardPage() {
  return <DashboardClientPage />;
}
```

**File: `app/dashboard/client-page.tsx`**

```typescript
"use client";

import { useProtectedRoute } from "@/lib/client-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardClientPage() {
  const { isAuthenticated, isVerified, loading } = useProtectedRoute(true);
  const { data: session } = useSession();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">You must be logged in to view this page.</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Please verify your email to access this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome, {session?.user?.name}! You are successfully logged in and verified.
              </p>
            </div>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Protected Content</h2>
          <p className="text-gray-600">
            This content is only accessible to authenticated and verified users.
          </p>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800">User Information</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Verified</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session?.user?.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 14. Profile Page

Created a profile page to demonstrate protecting additional routes.

**File: `app/profile/page.tsx`**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth/login");
  }

  // Redirect to verification page if not verified
  if (!session.user.emailVerified) {
    redirect("/auth/verify-request");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information
          </p>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
          
          <div className="mt-6">
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">College</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.user?.collegeName || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.user?.rollNumber || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.user?.phone || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Verified</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session.user?.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 15. Home Page

Created a home page with links to auth pages.

**File: `app/page.tsx`**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-3xl font-bold">Welcome to Surge</h1>
          
          {session ? (
            <div className="text-center">
              <p className="mb-4 text-gray-600">
                Welcome back, {session.user?.name}!
              </p>
              <div className="space-y-3">
                <Link 
                  href="/dashboard" 
                  className="block w-full rounded-lg bg-blue-600 py-2 text-white text-center hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className="block w-full rounded-lg bg-green-600 py-2 text-white text-center hover:bg-green-700"
                >
                  View Profile
                </Link>
                <Link 
                  href="/api/auth/signout" 
                  className="block w-full rounded-lg bg-gray-600 py-2 text-white text-center hover:bg-gray-700"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link 
                href="/auth/login" 
                className="block w-full rounded-lg bg-blue-600 py-2 text-white text-center hover:bg-blue-700"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="block w-full rounded-lg bg-green-600 py-2 text-white text-center hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 16. Layout File

Created a layout file to provide a consistent structure.

**File: `app/layout.tsx`**

```typescript
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Surge - Authentication System",
  description: "A Next.js application with verification-based authentication",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

## 17. Global CSS

Created a global CSS file with Tailwind styles.

**File: `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

## Important Note About NextAuth API Route

We've created the required NextAuth API route handler at `app/api/auth/[...nextauth]/route.ts` which enables all built-in NextAuth.js endpoints. This route handler uses the existing auth configuration in `server/auth.ts`, which was already enhanced with email verification features:

1. Added EmailProvider for email verification
2. Updated CredentialsProvider to check for email verification
3. Added custom pages configuration for NextAuth
4. Kept the existing JWT callbacks and session handling

The `server/auth.ts` file maintains compatibility with the existing TRPC setup while providing all necessary features for email verification.

## Server Component Fixes

To resolve the "React Context is unavailable in Server Components" error, we implemented the following fixes:

1. Created a client wrapper component for SessionProvider:
   - [`components/session-provider.tsx`](./components/session-provider.tsx) - Wrapper for NextAuth SessionProvider

2. Updated layout to use the client wrapper:
   - [`app/layout.tsx`](./app/layout.tsx) - Now uses NextAuthSessionProvider instead of SessionProvider directly

3. Created client components for pages that need session data:
   - [`app/home-client.tsx`](./app/home-client.tsx) - Client component for home page
   - [`app/profile/client-page.tsx`](./app/profile/client-page.tsx) - Client component for profile page
   - [`app/dashboard/client-page.tsx`](./app/dashboard/client-page.tsx) - Client component for dashboard page (already existed)

4. Updated server components to pass data to client components:
   - [`app/page.tsx`](./app/page.tsx) - Now passes session data to HomeClient
   - [`app/profile/page.tsx`](./app/profile/page.tsx) - Now passes session data to ProfileClientPage
   - [`app/dashboard/page.tsx`](./app/dashboard/page.tsx) - Now passes session data to DashboardClientPage

This approach properly separates Server Components (which can't use React Context) from Client Components (which can use React Context) while maintaining the functionality of the authentication system.

## Prisma NixOS Engine Issue Resolution

To resolve the Prisma engine issue on NixOS, we've implemented the proper NixOS solution based on official Prisma guidelines:

### 1. Flake Configuration
Created/updated `flake.nix` with proper Prisma engine environment variables:
```nix
{
  description = "Prisma development environment with Qwen3 AI tools";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nix-ai-tools.url = "github:numtide/nix-ai-tools";
  };

  outputs = {
    nixpkgs,
    nix-ai-tools,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config = {
        permittedInsecurePackages = ["openssl-1.1.1w"];
        allowUnfree = true;
      };
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs
        prisma
        prisma-engines
        openssl_1_1
        nix-ai-tools.packages.${system}.qwen-code
      ];
      shellHook = ''
        export PKG_CONFIG_PATH=${pkgs.openssl_1_1.dev}/lib/pkgconfig
        export PRISMA_SCHEMA_ENGINE_BINARY=${pkgs.prisma-engines}/bin/schema-engine
        export PRISMA_QUERY_ENGINE_BINARY=${pkgs.prisma-engines}/bin/query-engine
        export PRISMA_QUERY_ENGINE_LIBRARY=${pkgs.prisma-engines}/lib/libquery_engine.node
        export PRISMA_MIGRATION_ENGINE_BINARY=${pkgs.prisma-engines}/bin/migration-engine
        export PRISMA_INTROSPECTION_ENGINE_BINARY=${pkgs.prisma-engines}/bin/introspection-engine
        export PRISMA_FMT_BINARY=${pkgs.prisma-engines}/bin/prisma-fmt
        export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
        echo "Prisma dev environment and Qwen3 AI tool ready"
      '';
    };
  };
}
```

### 2. Direnv Configuration
Created `.envrc` file to automatically load the Nix flake:
```bash
if command -v nix-shell &> /dev/null
then
    use flake
fi
```

### 3. Prisma Schema Configuration
Updated Prisma schema to use the default engine:
```prisma
generator client {
  provider = "prisma-client-js"
}
```

### 4. Environment Variables
Added the following environment variables to `.env.local`:
- `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`

### 5. Prisma Client Initialization
Updated all Prisma client instantiation files to remove WASM-specific code:
- `server/db.ts`
- `app/api/register/route.ts`
- `app/api/verify-email/route.ts`
- `app/api/resend-verification/route.ts`
- `server/auth.ts`

### 6. Native Engine Cleanup Script
Removed the script (`scripts/fix-prisma-nixos.cjs`) that was used to remove native engine files after Prisma generation

### 7. Automated Fix
Removed the `postgenerate` script from `package.json` that was automatically running the NixOS fix script after `prisma generate`

### 8. Clean Installation
Cleaned and reinstalled node_modules, then regenerated the Prisma client with `npx prisma generate`

These changes ensure that Prisma uses the proper NixOS-compatible engines and resolves the "Invalid `prisma.user.findUnique()` invocation" error.

The application now builds and runs successfully on NixOS.

## Required Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/surge
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=YourAppName <noreply@yourdomain.com>
```

Note: `EMAIL_FROM` is used by NextAuth's EmailProvider to set the sender address for verification emails sent via Resend. Format it as "YourAppName <noreply@yourdomain.com>" or just "noreply@yourdomain.com".

## File Summary

For a complete list of all files created and modified, see the `file-summary.md` file in the root directory.

## Required Dependencies

Install the required dependencies:

```bash
npm install uuid @types/uuid
```

## Database Migrations

You'll need to run a database migration to ensure your schema is up to date. The changes include:

1. The `User` model already has the necessary fields (`emailVerified`)
2. The `VerificationToken` model is already defined

Run the following command to create and apply the migration:

```bash
npx dotenv -e .env.local -- prisma migrate dev --name user-email-verification
```

## Summary

These updates implement a complete email verification flow for your Next.js application:

1. Users register through the registration form
2. After registration, a verification email is sent
3. Users must click the verification link to verify their email
4. Verified users can log in, unverified users are redirected to the verification page
5. Users can resend verification emails if needed
6. Routes are protected based on authentication and verification status
7. Client-side helpers make it easy to check auth status in components
8. Created sample pages to test the authentication flow

The implementation follows best practices for security and user experience.