import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "A valid email is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    // If user doesn't exist, return a generic message to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Check if email service is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Email service is not configured on the server." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const token = uuidv4();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const identifier = `reset_${trimmedEmail}`;

    // Clean up any existing reset tokens for this user
    await db.verificationToken.deleteMany({
      where: { identifier },
    });

    // Save fresh token
    await db.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
        userId: user.id,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(trimmedEmail)}`;
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    await resend.emails.send({
      from: emailFrom,
      to: trimmedEmail,
      subject: "Reset your Surge 2026 Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 20px; }
            .container { max-width: 540px; margin: 0 auto; background: #161e31; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
            .logo { font-size: 28px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 24px; }
            h2 { font-size: 22px; color: #ffffff; margin-bottom: 16px; }
            p { font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
            .btn { display: block; width: fit-content; margin: 0 auto 24px auto; background: linear-gradient(135deg, #0C56BC, #00308F); color: #ffffff !important; padding: 14px 32px; border-radius: 10px; font-weight: 700; text-decoration: none; text-align: center; }
            .footer { font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SURGE 2026</div>
            <h2>Password Reset Request</h2>
            <p>Hi ${user.name || "Athlete"},</p>
            <p>We received a request to reset your password for your Surge 2026 account. Click the button below to choose a new password. This link is valid for <strong>15 minutes</strong>.</p>
            <a href="${resetUrl}" class="btn">Reset Password</a>
            <p style="font-size: 13px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a></p>
            <div class="footer">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
