import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

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

    const resend = new Resend(process.env.RESEND_API_KEY);

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
    
    try {
      const emailResult = await resend.emails.send({
        from: process.env.EMAIL_FROM,
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
      
      console.log("Verification email resent:", emailResult);
      
      return NextResponse.json(
        { message: "Verification email sent successfully" },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Error resending verification email:", emailError);
      return NextResponse.json(
        { 
          message: "Failed to resend verification email",
          error: emailError instanceof Error ? emailError.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}