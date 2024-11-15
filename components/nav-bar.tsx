"use client";

import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NavBar({ user }: { user: boolean | null }) {
  const { data: session } = useSession();
  const [hasValidSubscription, setHasValidSubscription] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user) {
        const response = await fetch("/api/check-subscription");
        const { isValid } = await response.json();
        setHasValidSubscription(isValid);
      }
    };

    checkSubscription();
  }, [session]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <h1
              className={cn(
                "text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent transition-all duration-300 group-hover:to-primary/40"
              )}
            >
              Investor List
            </h1>
            <ArrowUpRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          {session && hasValidSubscription && (
            <>
              <Link
                href="/investors"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Investors
              </Link>
              <Link
                href="/dashboard"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </>
          )}
          {user && (
            <Link
              href="/admin"
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
        <UserNav />
      </div>
    </header>
  );
}
