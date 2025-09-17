# Surge - Authentication and Email Verification System

This application implements a complete email verification flow for user authentication.

## Email Setup

To enable email functionality, you need to set up the following environment variables in a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/surge

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this

# Resend Email (for email verification)
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=Surge <noreply@yourdomain.com>
```

### Getting a Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for an account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### Setting up Email Domain

1. In your Resend dashboard, go to the "Domains" section
2. Add your domain (or use resend's provided domain for testing)
3. Follow the DNS verification steps
4. Set the `EMAIL_FROM` variable to use your verified domain

## Testing Email Functionality

You can test if email sending is working correctly by running:

```bash
npm run test:email
```

This will send a test email using your configured Resend credentials.

## Authentication Flow

1. Users register through the registration form
2. After registration, a verification email is sent
3. Users must click the verification link to verify their email
4. Verified users can log in, unverified users are redirected to the verification page
5. Users can resend verification emails if needed

## tRPC Procedures and Their Routes

Below is a summary of all available tRPC procedures, grouped by router and
suffixed with their route.\
The route for each procedure is `/api/trpc/{router}.{procedure}`.

---

## reg router (`/api/trpc/reg.*`)

- **getAvailableSports**: `/api/trpc/reg.getAvailableSports`
- **getEventDetails**: `/api/trpc/reg.getEventDetails`
- **createTeamWithMembers**: `/api/trpc/reg.createTeamWithMembers`
- **getCart**: `/api/trpc/reg.getCart`
- **deleteTeamFromCart**: `/api/trpc/reg.deleteTeamFromCart`

---

## payment router (`/api/trpc/payment.*`)

_(Procedures not listed—check `server/api/routers/payments.ts` for details.)_

---

## events router (`/api/trpc/events.*`)

_(Procedures not listed—check `server/api/routers/events.ts` for details.)_

---

## user router (`/api/trpc/user.*`)

_(Procedures not listed—check `server/api/routers/user.ts` for details.)_

---

## accommodation router (`/api/trpc/accommodation.*`)

_(Procedures not listed—check `server/api/routers/accommodation.ts` for
details.)_

---

> **Note:**\
> For a complete list of procedures in each router, see the corresponding file

# for pushing seed events

```bash
node --loader ts-node/esm prisma/seed-events.ts
```
