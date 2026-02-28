import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const review = await prisma.customerReview.findUnique({
      where: { id: params.id },
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
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const updated = await prisma.customerReview.update({
      where: { id: params.id },
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
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.customerReview.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ message: "Failed to delete review" }, { status: 500 });
  }
}

