import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const idsToCancel: string[] = body.paymentDetailsIds || (body.paymentDetailsId ? [body.paymentDetailsId] : []);

    if (idsToCancel.length === 0) {
      return NextResponse.json({ error: "Missing paymentDetailsId or paymentDetailsIds" }, { status: 400 });
    }

    const payments = await db.paymentDetails.findMany({
      where: { id: { in: idsToCancel } },
      include: { Teams: true },
    });

    if (payments.length === 0) {
      return NextResponse.json({ error: "Payments not found" }, { status: 404 });
    }

    // Only allow cancelling if still PENDING
    const nonPending = payments.some((p) => p.paymentStatus !== "PENDING");
    if (nonPending) {
      return NextResponse.json(
        { error: "Cannot cancel a payment that is already confirmed or rejected." },
        { status: 400 }
      );
    }

    // Check that the teams belong to this user
    for (const payment of payments) {
      const unauthorized = payment.Teams.some((t) => t.registeredById !== session.user.id);
      if (unauthorized) {
        return NextResponse.json({ error: "Unauthorized access to this payment." }, { status: 403 });
      }
    }

    // Safely reset payment status back to NOT_PAID without deleting any records
    await db.paymentDetails.updateMany({
      where: { id: { in: idsToCancel } },
      data: {
        paymentStatus: "NOT_PAID",
        paymentProofUrl: null,
        razorpayPaymentId: null,
        razorpayOrderId: null,
        razorpaySignature: null,
        changedStatus: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Submission cancelled and returned to unpaid status." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
