import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientHome } from "@/components/client-home";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    select: { isAdmin: true },
  });

  const assets = await prisma.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ClientHome initialAssets={assets} isAdmin={user?.isAdmin || false} />;
}
