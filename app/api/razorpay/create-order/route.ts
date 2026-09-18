import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to proceed with payment." },
        { status: 401 }
      );
    }

    const { teamIds } = await req.json();
    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json(
        { error: "Please provide valid team IDs for payment." },
        { status: 400 }
      );
    }

    // Verify all teams belong to this user and are either unpaid or still PENDING
    const teams = await db.team.findMany({
      where: {
        id: { in: teamIds },
        registeredById: session.user.id,
        OR: [
          { paymentDetailsId: null },
          { PaymentDetails: { paymentStatus: "PENDING" } },
        ],
      },
      include: {
        Event: true,
        TeamMembers: true,
        PaymentDetails: true,
      },
    });

    if (teams.length === 0) {
      return NextResponse.json(
        { error: "No unpaid or pending teams found matching the provided selection." },
        { status: 404 }
      );
    }

    // Calculate total price based on pricePerPlayer * number of team members
    const totalAmount = teams.reduce((sum, team) => {
      const price = team.Event?.pricePerPlayer || 0;
      const count = team.TeamMembers?.length || 0;
      return sum + price * count;
    }, 0);

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Total registration fee must be greater than 0." },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { 
          error: "Razorpay keys are not configured yet. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.development, or use the Manual / Offline Payment option.",
          configured: false
        },
        { status: 503 }
      );
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { error: "Failed to initialize Razorpay client." },
        { status: 500 }
      );
    }

    const receipt = `srg_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 1000)}`;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt,
      notes: {
        userId: session.user.id,
        userName: session.user.name || "",
        userEmail: session.user.email || "",
        teamIds: teamIds.join(","),
      },
    });

    // Clean up previous pending PaymentDetails for these teams if they were abandoned
    const previousPendingIds = teams
      .map((t) => t.paymentDetailsId)
      .filter((id): id is string => Boolean(id));

    // Create a new PaymentDetails record in PENDING state
    const payment = await db.paymentDetails.create({
      data: {
        amount: totalAmount,
        paymentStatus: "PENDING",
        razorpayOrderId: order.id,
        paymentMethod: "RAZORPAY",
      },
    });

    // Link teams to this new pending payment
    await db.team.updateMany({
      where: { id: { in: teamIds } },
      data: { paymentDetailsId: payment.id },
    });

    // Delete orphaned abandoned pending records
    if (previousPendingIds.length > 0) {
      for (const oldId of previousPendingIds) {
        if (oldId !== payment.id) {
          const linkedTeams = await db.team.count({ where: { paymentDetailsId: oldId } });
          if (linkedTeams === 0) {
            await db.paymentDetails.delete({ where: { id: oldId } }).catch(() => null);
          }
        }
      }
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount, // in paise
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      paymentDetailsId: payment.id,
      user: {
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { 
        error: "Failed to create Razorpay payment order", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
