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
  reviewCount: product.reviews.length,
});

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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getProductBySlugOrId = async (slug: string) =>
  (await prisma.product.findUnique({
    where: { slug },
    include: {
      categories: true,
      healthBenefits: true,
      culinaryUses: true,
      images: true,
      reviews: { select: { rating: true } },
    },
  })) ??
  (await prisma.product.findUnique({
    where: { id: slug },
    include: {
      categories: true,
      healthBenefits: true,
      culinaryUses: true,
      images: true,
      reviews: { select: { rating: true } },
    },
  }));

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const product = await getProductBySlugOrId(params.slug);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(mapProduct(product), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const existing = await getProductBySlugOrId(params.slug);
    if (!existing) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const categoryItems = splitList(body.category);
    const healthItems = splitList(body.healthBenefit);
    const culinaryItems = splitList(body.culinaryUses);

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        name: typeof body.name === "string" ? body.name : existing.name,
        slug: typeof body.slug === "string" ? body.slug : existing.slug,
        description:
          typeof body.description === "string" ? body.description : existing.description,
        origin: typeof body.origin === "string" ? body.origin : existing.origin,
        price: typeof body.price === "number" ? body.price : existing.price,
        stock: typeof body.stock === "number" ? body.stock : existing.stock,
        featured:
          typeof body.isNew === "boolean" ? body.isNew : existing.featured,
        categories: categoryItems.length
          ? {
              set: [],
              connectOrCreate: categoryItems.map((title) => ({
                where: { slug: slugify(title) },
                create: { title, slug: slugify(title), stock: existing.stock },
              })),
            }
          : undefined,
        healthBenefits: healthItems.length
          ? {
              deleteMany: {},
              create: healthItems.map((benefit) => ({ benefit })),
            }
          : undefined,
        culinaryUses: culinaryItems.length
          ? {
              deleteMany: {},
              create: culinaryItems.map((use) => ({ use })),
            }
          : undefined,
        ...(typeof body.images === "string" && body.images.trim()
          ? {
              images: {
                deleteMany: {},
                create: [{ url: body.images }],
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

    return NextResponse.json(mapProduct(updated), { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const existing = await getProductBySlugOrId(params.slug);
    if (!existing) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}

