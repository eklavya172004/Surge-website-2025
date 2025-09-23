# Authentication System - Compact Summary

This document provides a concise overview of the verification-based authentication system implementation.

## Overview

The system implements email verification for user authentication:
1. Users register and receive a verification email
2. Users must verify their email before logging in
3. Routes are protected based on authentication and verification status

## Key Components

### [NextAuth Configuration](./server/auth.ts)
- Credentials provider with verification check
- Email provider for verification emails
- JWT callbacks for verification status
- Custom pages configuration

### [NextAuth API Route](./app/api/auth/[...nextauth]/route.ts)
- NextAuth.js catch-all route handler
- Enables all built-in NextAuth.js endpoints (`/api/auth/signin`, `/api/auth/signout`, etc.)

### [Registration API](./app/api/register/route.ts)
- User creation with bcrypt password hashing
- Verification token generation
- [Email sending](./server/verfiy.ts) via Resend

### [Email Verification](./app/api/verify-email/route.ts)
- Token validation endpoint
- User verification status update
- Token cleanup after use

### [Verification Resend](./app/api/resend-verification/route.ts)
- New token generation for unverified users
- Duplicate token cleanup

## Auth Pages

- [Login Page](./app/auth/login/page.tsx) - Handles credentials with verification check
- [Registration Page](./app/auth/register/page.tsx) - Form with validation
- [Verification Request](./app/auth/verify-request/page.tsx) - Email verification prompt
- [Error Page](./app/auth/error/page.tsx) - Authentication error display

## Protected Pages

- [Dashboard](./app/dashboard/page.tsx) - Sample protected route
- [Profile](./app/profile/page.tsx) - User profile information

## Client-Side Protection

### [Authentication Hooks](./lib/client-auth.ts)
- `useAuth()` - Authentication status checker
- `useProtectedRoute()` - Route protection hook

## Middleware

### [Route Protection](./middleware.ts)
- NextAuth middleware with verification check
- Protected paths: `/dashboard/*`, `/profile/*`

## Components

### [Session Provider](./components/session-provider.tsx)
- Wrapper for NextAuth SessionProvider to work with Server Components

## Important Notes

1. **Environment Variables**: See [updates.md](./updates.md#required-environment-variables)
   - `EMAIL_FROM` is used by NextAuth's EmailProvider for Resend emails
2. **Dependencies**: Install `uuid` and `@types/uuid`
3. **Database Migration**: Run `npx dotenv -e .env.local -- prisma migrate dev --name user-email-verification`
4. **Resolution**: Existing `server/auth.ts` has been enhanced rather than replaced to maintain TRPC compatibility
5. **Server Components**: Properly handled React Context usage in Server Components
6. **Prisma NixOS Fix**: Implemented proper NixOS solution with flake configuration and environment variables

## Testing Flow

1. Visit [/auth/register](./app/auth/register/page.tsx)
2. Complete registration form
3. Check email for verification link
4. Click verification link
5. Visit [/auth/login](./app/auth/login/page.tsx)
6. Login with credentials
7. Access [/dashboard](./app/dashboard/page.tsx) or [/profile](./app/profile/page.tsx)

## File Summary

See [file-summary.md](./file-summary.md) for a complete list of created/modified files.