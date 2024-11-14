"use client";

import { useState } from "react";
import { AddAssetDialog } from "./add-asset-dialog";
import { Button } from "./ui/button";

interface AddAssetButtonProps {
  isAdmin?: boolean;
  onDelete?: (assetId: string) => void;
}

export function AddAssetButton({ isAdmin, onDelete }: AddAssetButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Asset</Button>
      <AddAssetDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
