import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.asset.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ASSET_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 