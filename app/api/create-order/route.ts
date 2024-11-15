import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    console.log("API: Starting order creation");
    console.log("API: Razorpay instance:", razorpay);
    
    const body = await req.json();
    console.log("API: Request body:", body);
    
    const { amount, currency, receipt, notes } = body;
    
    console.log("API: Creating order with:", { amount, currency, receipt, notes });
    
    const order = await razorpay.orders.create({
      amount: parseInt(amount),
      currency,
      receipt,
      notes,
    });
    
    console.log("API: Order created:", order);
    
    const response = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    };
    
    console.log("API: Sending response:", response);
    
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("API: Create order error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create order",
        details: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
