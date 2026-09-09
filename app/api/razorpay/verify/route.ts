import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // Verify cryptographic signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error(`Invalid signature for order ${razorpay_order_id}`);
      return NextResponse.json(
        { error: "Payment verification failed: Invalid signature." },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.paymentDetails.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: {
        Teams: {
          include: {
            Event: true,
            TeamMembers: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "No matching payment record found for this order." },
        { status: 404 }
      );
    }

    // Update payment record to PAID
    const updatedPayment = await db.paymentDetails.update({
      where: { id: payment.id },
      data: {
        paymentStatus: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentMethod: "RAZORPAY",
        changedStatus: new Date(),
      },
    });

    // Send confirmation email via Resend
    if (session.user.email && process.env.EMAIL_FROM && process.env.RESEND_API_KEY) {
      try {
        const eventsList = payment.Teams.map(
          (t) => `<li><strong>${t.Event?.name || "Event"}</strong> (${t.TeamMembers?.length || 0} players)</li>`
        ).join("");

        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: session.user.email,
          subject: "Payment Confirmed - Surge 2026",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
              <h2 style="color: #16a34a; margin-bottom: 8px;">Payment Successful!</h2>
              <p>Hi <strong>${session.user.name || "Participant"}</strong>,</p>
              <p>Your payment for Surge 2026 sports registration has been successfully verified.</p>
              
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${payment.amount}</p>
                <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                <p style="margin: 4px 0;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
                <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">PAID</span></p>
              </div>

              <h3>Registered Events:</h3>
              <ul style="padding-left: 20px;">
                ${eventsList}
              </ul>

              <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                If you have any questions regarding your registration or schedule, reach out to the Surge sports desk.
              </p>
            </div>
          `,
        });
        console.log(`Payment confirmation email sent to ${session.user.email}`);
      } catch (emailErr) {
        console.error("Failed to send payment confirmation email:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified.",
      paymentId: razorpay_payment_id,
      amount: updatedPayment.amount,
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json(
      { 
        error: "Failed to verify payment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
