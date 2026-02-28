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
}) => ({
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
});

export async function GET(
  _request: Request,
  { params }: { params: { category: string } },
) {
  try {
    const category = params.category;
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            OR: [{ slug: category }, { title: { equals: category, mode: "insensitive" } }],
          },
        },
      },
      include: {
        categories: true,
        healthBenefits: true,
        culinaryUses: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products.map(mapProduct), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return NextResponse.json(
      { message: "Failed to fetch products by category" },
      { status: 500 },
    );
  }
}

