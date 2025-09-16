import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
    await prisma.user.create({
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
