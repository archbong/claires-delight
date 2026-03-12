import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPost } from "@/lib/data";

const getPostBySlugOrId = async (slug: string) =>
  (await prisma.post.findUnique({ where: { slug }, select: { id: true } })) ??
  (await prisma.post.findUnique({ where: { id: slug }, select: { id: true } }));

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const post = await getPost(slug);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ message: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const existing = await getPostBySlugOrId(slug);
    if (!existing) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updated = await prisma.post.update({
      where: { id: existing.id },
      data: {
        ...(typeof body.title === "string" ? { title: body.title } : {}),
        ...(typeof body.slug === "string" ? { slug: body.slug } : {}),
        ...(typeof body.content === "string" ? { content: body.content } : {}),
        ...(typeof body.excerpt === "string" ? { excerpt: body.excerpt } : {}),
        ...(typeof body.featuredImage === "string"
          ? { featuredImage: body.featuredImage }
          : {}),
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ message: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const existing = await getPostBySlugOrId(slug);
    if (!existing) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    await prisma.post.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ message: "Failed to delete post" }, { status: 500 });
  }
}
