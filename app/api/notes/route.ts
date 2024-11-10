import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, investorId } = await req.json();

    // Validate input
    if (!content?.trim()) {
      return new NextResponse("Note content is required", { status: 400 });
    }
    if (!investorId) {
      return new NextResponse("Investor ID is required", { status: 400 });
    }

    const note = await prisma.note.upsert({
      where: {
        investorId_userId: {
          investorId: investorId.toString(),
          userId: session.user.email,
        },
      },
      update: {
        content: content.trim(),
        updatedAt: new Date(),
      },
      create: {
        content: content.trim(),
        investorId: investorId.toString(),
        userId: session.user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTES_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get("investorId");

    if (!investorId) {
      return new NextResponse("Missing investorId", { status: 400 });
    }

    const note = await prisma.note.findUnique({
      where: {
        investorId_userId: {
          investorId: investorId.toString(),
          userId: session.user.email,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTES_GET]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    );
  }
}
