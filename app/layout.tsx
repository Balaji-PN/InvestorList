import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { NavBar } from "@/components/nav-bar";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const isAdmin = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    select: { isAdmin: true },
  });
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar user={isAdmin?.isAdmin || false} />
          <main className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
