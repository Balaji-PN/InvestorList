import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        isSubscribed: true,
        subscriptionEndDate: true,
      }
    });

    // Check if user was ever subscribed (either currently subscribed or has a past subscription)
    const hadPreviousSubscription = user?.isSubscribed || (user?.subscriptionEndDate !== null);

    return NextResponse.json({
      hadPreviousSubscription,
    });
  } catch (error) {
    console.error("Error checking previous subscription:", error);
    return NextResponse.json(
      { error: "Failed to check previous subscription status" },
      { status: 500 }
    );
  }
} 