"use client";

import { Inter, Montserrat } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <h1
                    className={cn(
                      "text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent transition-all duration-300 group-hover:to-primary/40",
                      montserrat.className
                    )}
                  >
                    Investor List
                  </h1>
                  <ArrowUpRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-45" />
                </div>
                <div className="flex items-center">
                  <UserNav />
                </div>
              </div>
            </header>
            <main className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6">{children}</main>
            <Toaster />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
