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