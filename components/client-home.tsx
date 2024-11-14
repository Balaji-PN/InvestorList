"use client";

import { Asset } from "@prisma/client";
import { useState } from "react";
import { AssetList } from "./asset-list";
import { AddAssetButton } from "./add-asset-button";
import { useSession } from "next-auth/react";

interface ClientHomeProps {
  initialAssets: Asset[];
  isAdmin: boolean;
}

export function ClientHome({ initialAssets, isAdmin }: ClientHomeProps) {
  const [assets, setAssets] = useState(initialAssets);

  const handleAssetAdded = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
  };

  const session = useSession();

  return (
    <main className="w-full py-4 md:py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-semibold text-primary">
          Hi, {session.data?.user?.name}!
        </h1>
      </div>
      <div className="flex flex-col gap-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">Your Assets</h2>
            {isAdmin && <AddAssetButton onAssetAdded={handleAssetAdded} />}
          </div>
          <AssetList
            initialAssets={assets}
            isAdmin={isAdmin}
            onAssetsChange={setAssets}
          />
        </section>
      </div>
    </main>
  );
}
