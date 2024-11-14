"use client";

import { useState } from "react";
import { AddAssetDialog } from "./add-asset-dialog";
import { Button } from "./ui/button";
import { Asset } from "@prisma/client";

interface AddAssetButtonProps {
  isAdmin?: boolean;
  onAssetAdded?: (asset: Asset) => void;
}

export function AddAssetButton({ isAdmin, onAssetAdded }: AddAssetButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Asset</Button>
      <AddAssetDialog
        open={open}
        onOpenChange={setOpen}
        onAssetAdded={onAssetAdded}
      />
    </>
  );
}
