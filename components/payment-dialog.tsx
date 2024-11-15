"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentDialog({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/check-subscription?userId=${userId}`);
        const data = await response.json();
        setAmount(data.hadPreviousSubscription ? 30000 : 270000);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setAmount(270000);
      }
    };

    checkSubscription();
  }, [userId]);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            description: "Access to Investor Database",
            userId,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Investor List",
        description: "Access to Investor Database",
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            toast({
              title: "Payment Successful",
              description: "Redirecting to investors page...",
            });

            setIsOpen(false);
            router.push("/investors");
          } catch (error) {
            toast({
              title: "Error",
              description: "Payment verification failed. Please try again.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        },
        theme: {
          color: "#FF3E1D",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function () {
        toast({
          title: "Payment Failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      });
      rzp1.open();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold">₹{amount / 100}</p>
            <p className="text-sm text-muted-foreground">
              One-time payment for lifetime access
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">What you get:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Access to 500+ verified investors</li>
              <li>• Direct contact information</li>
              <li>• Regular database updates</li>
              <li>• Investment preferences & details</li>
            </ul>
          </div>
          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount / 100}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
