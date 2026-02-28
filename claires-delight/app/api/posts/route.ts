import { NextResponse } from "next/server";
import { getPosts } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const authorInput = String(body.authorId ?? body.author ?? "");
    const author =
      (await prisma.user.findUnique({ where: { id: authorInput }, select: { id: true } })) ??
      (await prisma.user.findUnique({ where: { username: authorInput }, select: { id: true } })) ??
      (await prisma.user.findUnique({ where: { email: authorInput }, select: { id: true } })) ??
      (await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } }));

    if (!author) {
      return NextResponse.json({ message: "Author not found" }, { status: 400 });
    }

    const created = await prisma.post.create({
      data: {
        title: String(body.title ?? ""),
        slug: String(body.slug ?? ""),
        content: String(body.content ?? ""),
        excerpt: typeof body.excerpt === "string" ? body.excerpt : null,
        featuredImage:
          typeof body.featuredImage === "string" ? body.featuredImage : null,
        authorId: author.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ message: "Failed to create post" }, { status: 500 });
  }
}
