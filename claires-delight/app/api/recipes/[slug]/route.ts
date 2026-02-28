import { NextResponse } from "next/server";
import { getRecipe } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const splitList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  return [];
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const recipe = await getRecipe(params.slug);
    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return NextResponse.json({ message: "Failed to fetch recipe" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const existing =
      (await prisma.recipe.findUnique({ where: { slug: params.slug }, select: { id: true } })) ??
      (await prisma.recipe.findUnique({ where: { id: params.slug }, select: { id: true } }));

    if (!existing) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const ingredients = splitList(body.ingredients);
    const method = splitList(body.method || body.instructions);

    await prisma.recipe.update({
      where: { id: existing.id },
      data: {
        ...(typeof body.title === "string" ? { title: body.title } : {}),
        ...(typeof body.slug === "string" ? { slug: body.slug } : {}),
        ...(typeof body.description === "string" ? { description: body.description } : {}),
        ...(typeof body.cuisine === "string" ? { cuisine: body.cuisine } : {}),
        ...(typeof body.servings === "number" ? { servings: body.servings } : {}),
        ...(typeof body.cookTime === "number" ? { cookingTime: body.cookTime } : {}),
        ...(typeof body.cookingTime === "number" ? { cookingTime: body.cookingTime } : {}),
        ingredients: ingredients.length
          ? {
              deleteMany: {},
              create: ingredients.map((name) => ({ name })),
            }
          : undefined,
        methodSteps: method.length
          ? {
              deleteMany: {},
              create: method.map((step, index) => ({ step, order: index + 1 })),
            }
          : undefined,
      },
    });

    const updated = await getRecipe(existing.id);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Failed to update recipe:", error);
    return NextResponse.json({ message: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const existing =
      (await prisma.recipe.findUnique({ where: { slug: params.slug }, select: { id: true } })) ??
      (await prisma.recipe.findUnique({ where: { id: params.slug }, select: { id: true } }));

    if (!existing) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    await prisma.recipe.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete recipe:", error);
    return NextResponse.json({ message: "Failed to delete recipe" }, { status: 500 });
  }
}

