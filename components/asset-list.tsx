"use client";

import { useState, useEffect } from "react";
import { Asset } from "@prisma/client";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetCard } from "@/components/asset-card";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AssetListProps {
  initialAssets: Asset[];
  isAdmin?: boolean;
  onAssetsChange?: (assets: Asset[]) => void;
}

export function AssetList({ initialAssets, isAdmin, onAssetsChange }: AssetListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assets, setAssets] = useState(initialAssets);
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= assets.length ? 0 : prev + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(assets.length - 3, 0) : prev - 3
    );
  };

  useEffect(() => {
    if (currentIndex >= assets.length) {
      setCurrentIndex(Math.max(0, assets.length - 3));
    }
  }, [assets.length, currentIndex]);

  const handleDeleteAsset = async () => {
    if (!deleteAssetId) return;

    try {
      const response = await fetch(`/api/assets/${deleteAssetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }

      const newAssets = assets.filter(asset => asset.id !== deleteAssetId);
      setAssets(newAssets);
      onAssetsChange?.(newAssets);
      
      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      });
    } finally {
      setDeleteAssetId(null);
    }
  };

  const visibleAssets = assets.slice(currentIndex, currentIndex + 3);

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleAssets.map((asset) => (
            <div key={asset.id} className="relative group">
              <AssetCard asset={asset} />
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setDeleteAssetId(asset.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {assets.length > 3 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteAssetId}
        onOpenChange={(open) => !open && setDeleteAssetId(null)}
        onConfirm={handleDeleteAsset}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action cannot be undone."
      />
    </>
  );
} 