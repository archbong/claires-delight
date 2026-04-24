import { NextResponse } from "next/server";
import { getCustomerReview } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await getCustomerReview();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Failed to get customer reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch customer reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const created = await prisma.customerReview.create({
      data: {
        name: String(body.name ?? "Anonymous"),
        description: String(body.description ?? ""),
        rating:
          typeof body.rating === "number"
            ? body.rating
            : body.rating
              ? Number(body.rating)
              : null,
        productId: String(body.productId ?? ""),
        ...(typeof body.userId === "string" && body.userId
          ? { userId: body.userId }
          : {}),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer review:", error);
    return NextResponse.json(
      { message: "Failed to create customer review" },
      { status: 500 },
    );
  }
}
