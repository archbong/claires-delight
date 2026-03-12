import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const review = await prisma.customerReview.findUnique({
      where: { id },
    });
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch review:", error);
    return NextResponse.json({ message: "Failed to fetch review" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const updated = await prisma.customerReview.update({
      where: { id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name } : {}),
        ...(typeof body.description === "string"
          ? { description: body.description }
          : {}),
        ...(typeof body.rating === "number"
          ? { rating: body.rating }
          : body.rating
            ? { rating: Number(body.rating) }
            : {}),
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ message: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    await prisma.customerReview.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ message: "Failed to delete review" }, { status: 500 });
  }
}
