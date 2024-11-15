"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentDialog } from "@/components/payment-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hadPreviousSubscription, setHadPreviousSubscription] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/check-subscription?userId=${session.user.email}`
          );
          const data = await response.json();
          setHadPreviousSubscription(data.hadPreviousSubscription);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };

    if (session?.user?.email) {
      checkSubscription();
    }
  }, [session]);

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-12 px-4">
      <div className="text-center space-y-8 max-w-3xl">
        <h1 className="text-4xl font-bold">
          Subscribe to Access Investor Database
        </h1>
        <p className="text-xl text-muted-foreground">
          Get instant access to our comprehensive database of verified investors
        </p>
        <div className="bg-card border rounded-xl p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                ₹{hadPreviousSubscription ? "300" : "2,700"}
              </h2>
              <p className="text-muted-foreground">
                {hadPreviousSubscription
                  ? "Monthly subscription renewal"
                  : "First month subscription"}
              </p>
              {!hadPreviousSubscription && (
                <p className="text-sm text-muted-foreground">
                  (₹300/month thereafter)
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-left">What you get:</h3>
              <ul className="space-y-3 text-left">
                {[
                  "Access to 500+ verified investors",
                  "Direct contact information",
                  "Investment preferences & details",
                  "Regular database updates",
                  "Priority support",
                  "Monthly new investor additions",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6">
              <PaymentDialog userId={session.user?.email!}>
                <Button size="lg" className="w-full text-lg">
                  Subscribe Now
                </Button>
              </PaymentDialog>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              By subscribing, you agree to our terms and conditions.
              Subscription will automatically renew at ₹300/month after the
              first month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
