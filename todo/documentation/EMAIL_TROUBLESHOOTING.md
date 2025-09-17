# Email Troubleshooting Guide

If emails are not being sent in your application, here are the most common issues and solutions:

## 1. Missing Environment Variables

Check that you have all required environment variables in your `.env.local` file:

```env
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=Surge <noreply@yourdomain.com>
NEXTAUTH_URL=http://localhost:3000
```

## 2. Invalid Resend API Key

Make sure your Resend API key is valid and active:

1. Go to your [Resend dashboard](https://resend.com/api-keys)
2. Verify that your API key is active
3. If needed, create a new API key and update your `.env.local` file

## 3. Domain Not Verified

Resend requires verified domains for sending emails:

1. Go to your [Resend domains](https://resend.com/domains)
2. Add and verify your domain
3. For testing, you can use Resend's provided domain

## 4. Test Email Functionality

Run the test script to verify email sending:

```bash
npm run test:email
```

## 5. Check Application Logs

Look at your application logs for error messages:

```bash
# If running with npm
npm run dev

# Or check production logs
# (depends on your deployment setup)
```

Common error messages:
- "RESEND_API_KEY is not set" - Missing API key
- "Missing sender domain" - Domain not verified
- "Invalid API key" - API key is incorrect or expired

## 6. Verify Database Connection

Email verification requires a working database:

1. Check that your `DATABASE_URL` is correct in `.env.local`
2. Verify that your database is running
3. Ensure the database migrations have been applied

## 7. Check Network/Firewall

If deploying to a server:

1. Ensure outbound connections on port 443 are allowed
2. Check if your hosting provider blocks email sending

## 8. Restart Your Application

After making changes to environment variables:

```bash
# Stop your application (Ctrl+C if running locally)
# Then restart
npm run dev
```