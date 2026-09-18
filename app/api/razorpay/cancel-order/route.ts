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

    const { paymentDetailsId } = await req.json();
    if (!paymentDetailsId) {
      return NextResponse.json({ error: "Missing paymentDetailsId" }, { status: 400 });
    }

    const payment = await db.paymentDetails.findUnique({
      where: { id: paymentDetailsId },
      include: { Teams: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Only allow cancelling if still PENDING
    if (payment.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { error: "Cannot cancel a payment that is already confirmed or rejected." },
        { status: 400 }
      );
    }

    // Check that the teams belong to this user
    const unauthorized = payment.Teams.some((t) => t.registeredById !== session.user.id);
    if (unauthorized) {
      return NextResponse.json({ error: "Unauthorized access to this payment." }, { status: 403 });
    }

    // Unlink teams from this payment
    await db.team.updateMany({
      where: { paymentDetailsId },
      data: { paymentDetailsId: null },
    });

    // Delete the pending PaymentDetails record
    await db.paymentDetails.delete({
      where: { id: paymentDetailsId },
    });

    return NextResponse.json({ success: true, message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
