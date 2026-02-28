import { NextResponse } from "next/server";
import { getRecipes } from "@/lib/data";
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

export async function GET() {
  try {
    const recipes = await getRecipes();
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = String(body.title ?? "");
    const slug = String(body.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    const description = String(body.description ?? "");
    const difficulty = String(body.difficulty ?? "MEDIUM").toUpperCase() as
      | "EASY"
      | "MEDIUM"
      | "HARD";
    const cookingTime = Number(body.cookTime ?? body.cookingTime ?? 0);
    const servings = Number(body.servings ?? 1);
    const cuisine = String(body.cuisine ?? "General");
    const ingredients = splitList(body.ingredients);
    const method = splitList(body.method || body.instructions);

    const author = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
    if (!author) {
      return NextResponse.json({ message: "No author found" }, { status: 400 });
    }

    const created = await prisma.recipe.create({
      data: {
        title,
        slug,
        description,
        cookingTime,
        difficulty,
        servings,
        cuisine,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: author.id,
        ingredients: {
          create: ingredients.map((name) => ({ name })),
        },
        methodSteps: {
          create: method.map((step, index) => ({ step, order: index + 1 })),
        },
      },
    });

    return NextResponse.json({ _id: created.id, slug: created.slug }, { status: 201 });
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return NextResponse.json({ message: "Failed to create recipe" }, { status: 500 });
  }
}

