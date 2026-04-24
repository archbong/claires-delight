import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { transaction_id, tx_ref } = await req.json();

    if (!transaction_id) {
      return NextResponse.json(
        { error: "Missing transaction_id" },
        { status: 400 }
      );
    }

    // 1. Verify with Flutterwave
    const res = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const payment = data.data;

    // 2. Validate payment integrity
    if (payment.status !== "successful") {
      return NextResponse.json(
        { error: "Payment not successful" },
        { status: 400 }
      );
    }

    // 3. Prevent double processing
    const existingOrder = await prisma.order.findFirst({
      where: { paymentReference: tx_ref },
    });

    if (existingOrder) {
      return NextResponse.json({ message: "Already processed" });
    }

    // 4. Mark order as paid
    const order = await prisma.order.create({
      data: {
        userId: payment.customer.email, // adjust to your user system
        totalAmount: payment.amount,
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
        status: "PROCESSING",
        shippingAddress: "Pending",
      },
    });

    // 5. Clear cart logic should be tied to user/session
    // (example placeholder)
    await prisma.cart.deleteMany({
      where: { userId: payment.customer.email },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error verifying payment" },
      { status: 500 }
    );
  }
}