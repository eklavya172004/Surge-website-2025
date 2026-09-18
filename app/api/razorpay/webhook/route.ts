import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // If webhook secret is configured, verify the signature
    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature({
        rawBody,
        signature,
      });

      if (!isValid) {
        console.error("Razorpay webhook signature verification failed.");
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    console.log(`Received Razorpay webhook event: ${eventType}`);

    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const payment = await db.paymentDetails.findUnique({
          where: { razorpayOrderId: orderId },
          include: {
            Teams: {
              include: {
                Event: true,
                registeredBy: true,
              },
            },
          },
        });

        if (payment && payment.paymentStatus !== "PAID") {
          await db.paymentDetails.update({
            where: { id: payment.id },
            data: {
              paymentStatus: "PAID",
              razorpayPaymentId: paymentId,
              paymentMethod: "RAZORPAY",
              changedStatus: new Date(),
            },
          });

          console.log(`PaymentDetails for order ${orderId} successfully marked PAID via webhook.`);

          const captain = payment.Teams[0]?.registeredBy;
          if (captain?.email && process.env.EMAIL_FROM && process.env.RESEND_API_KEY) {
            try {
              await resend.emails.send({
                from: process.env.EMAIL_FROM,
                to: captain.email,
                subject: "Surge 2026 - Payment Confirmation",
                html: `
                  <p>Hi ${captain.name},</p>
                  <p>Your payment of ₹${payment.amount} for Surge 2026 has been confirmed (Order ID: ${orderId}).</p>
                  <p>Check your dashboard for team schedules and event details.</p>
                `,
              });
            } catch (mailErr) {
              console.error("Error sending webhook confirmation email:", mailErr);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
