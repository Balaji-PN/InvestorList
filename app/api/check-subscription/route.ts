import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ isValid: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isSubscribed: true, subscriptionEndDate: true },
    });

    const isSubscriptionValid =
      user?.isSubscribed &&
      user?.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) > new Date();

    console.log("Subscription check:", {
      isSubscribed: user?.isSubscribed,
      endDate: user?.subscriptionEndDate,
      isValid: isSubscriptionValid,
      currentDate: new Date(),
    });

    return NextResponse.json({
      isValid: isSubscriptionValid,
      debug: {
        subscriptionEndDate: user?.subscriptionEndDate,
        currentDate: new Date(),
        isSubscribed: user?.isSubscribed,
      },
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
