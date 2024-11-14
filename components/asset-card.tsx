import { Asset } from "@prisma/client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <Image
          src={asset.image}
          alt={asset.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{asset.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{asset.description}</p>
      </CardContent>
    </Card>
  );
} 