"use client";

import { AddAssetButton } from "@/components/add-asset-button";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function AdminPage() {
  const [assets, setAssets] = useState<Array<{ id: string; url: string }>>([]);

  const handleDeleteAsset = async (assetId: string) => {
    try {
      // Add your delete API call here
      setAssets(assets.filter(asset => asset.id !== assetId));
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="relative">
            <Button
              onClick={() => handleDeleteAsset(asset.id)}
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 z-10 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative w-full h-48">
              <Image
                src={asset.url}
                alt="Asset"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        ))}
        <AddAssetButton isAdmin={true} />
      </div>
    </div>
  );
}
