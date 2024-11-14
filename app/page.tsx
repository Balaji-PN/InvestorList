import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AssetList } from "@/components/asset-list";
import { prisma } from "@/lib/prisma";
import { AddAssetButton } from "@/components/add-asset-button";

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

  return (
    <main className="w-full py-4 md:py-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Hi, {session.user?.name}! 👋
        </h1>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">Your Assets</h2>
            {user?.isAdmin && <AddAssetButton />}
          </div>
          <AssetList initialAssets={assets} isAdmin={user?.isAdmin} />
        </section>
      </div>
    </main>
  );
}
