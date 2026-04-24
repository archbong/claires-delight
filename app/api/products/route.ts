import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const mapProduct = (product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  price: number;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: { title: string; slug: string; stock: number }[];
  healthBenefits: { benefit: string }[];
  culinaryUses: { use: string }[];
  images: { url: string }[];
  reviews: { rating: number | null }[];
}) => {
  const ratings = product.reviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const rating =
    ratings.length > 0
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
      : undefined;

  return {
    _id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.categories.map((category) => ({
      title: category.title,
      slug: category.slug,
      stock: category.stock,
    })),
    origin: product.origin,
    healthBenefit: product.healthBenefits.map((item) => item.benefit),
    culinaryUses: product.culinaryUses.map((item) => item.use),
    price: product.price,
    stock: product.stock,
    images: product.images[0]?.url ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    isNew: product.featured,
    rating,
    reviewCount: product.reviews.length,
  };
};

const splitList = (value: unknown): string[] => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map(String).map((v) => v.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        healthBenefits: true,
        culinaryUses: true,
        images: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products.map(mapProduct), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = String(body.name ?? "");
    const slug = String(body.slug ?? slugify(name));
    const description = String(body.description ?? "");
    const origin = String(body.origin ?? "");
    const price = Number(body.price ?? 0);
    const stock = Number(body.stock ?? 0);
    const categoryItems = splitList(body.category);
    const healthItems = splitList(body.healthBenefit);
    const culinaryItems = splitList(body.culinaryUses);
    const imageUrl =
      typeof body.images === "string" && body.images.trim() ? body.images : null;

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        origin,
        price,
        stock,
        categories: {
          connectOrCreate: categoryItems.map((title) => ({
            where: { slug: slugify(title) },
            create: { title, slug: slugify(title), stock },
          })),
        },
        healthBenefits: {
          create: healthItems.map((benefit) => ({ benefit })),
        },
        culinaryUses: {
          create: culinaryItems.map((use) => ({ use })),
        },
        ...(imageUrl
          ? {
              images: {
                create: [{ url: imageUrl }],
              },
            }
          : {}),
      },
      include: {
        categories: true,
        healthBenefits: true,
        culinaryUses: true,
        images: true,
        reviews: { select: { rating: true } },
      },
    });

    return NextResponse.json(mapProduct(created), { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

