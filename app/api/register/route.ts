import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { registerRateLimiter, getClientIp } from "@/lib/rate-limiter";

const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // Apply rate limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = registerRateLimiter.check(clientIp);

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { message: "Too many registration attempts. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        }
      }
    );
  }
  try {
    const { email, password, name, collegeName, phone } =
      await req.json();
    if ((!email || !password || !name || !collegeName || !phone)) {
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
        rollNumber: null, // Explicitly set as null
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

    // Check if required environment variables are set
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { message: "Email service is not properly configured" },
        { status: 500 },
      );
    }

    if (!process.env.NEXTAUTH_URL) {
      console.error("NEXTAUTH_URL is not set");
      return NextResponse.json(
        { message: "Application URL is not properly configured" },
        { status: 500 },
      );
    }

    if (!process.env.EMAIL_FROM) {
      console.error("EMAIL_FROM is not set");
      return NextResponse.json(
        { message: "Email sender is not properly configured" },
        { status: 500 },
      );
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${verificationToken}`;
    
    try {
      const emailResult = await resend.emails.send({
        from: process.env.EMAIL_FROM,
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
      
      console.log("Verification email sent:", emailResult);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Even if email fails, we still want to register the user
      // They can use the resend verification feature
      return NextResponse.json(
        { 
          message: "User created but failed to send verification email. Please use the resend verification feature.",
          error: emailError instanceof Error ? emailError.message : "Unknown error"
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email for verification.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user:", error);

    return NextResponse.json(
      {
        msg: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      {
        status: 500,
      },
    );
  }
}
