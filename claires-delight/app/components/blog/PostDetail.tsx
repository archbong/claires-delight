"use client";

import Image from "next/image";
import { Suspense } from "react";
import BodyWrapper from "@/app/components/layout/BodyWrapper";
import BlogRenderer from "./BlogRender";

interface PostDetailItem {
  title: string;
  content: string;
  featuredImage?: string | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date;
}

interface PostDetailProps {
  post: PostDetailItem;
}

export default function PostDetail({ post }: Readonly<PostDetailProps>) {
  if (!post) {
    return null;
  }

  const toDisplayDate = (value?: string | Date | null) => {
    if (!value) return "";
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const imageSrc =
    typeof post?.featuredImage === "string" &&
      post.featuredImage.trim() !== "" &&
      post.featuredImage !== "null" &&
      post.featuredImage !== "undefined"
      ? post.featuredImage
      : "/placeholder.svg";
  const displayDate = toDisplayDate(post?.publishedAt ?? post?.createdAt ?? null);

  return (
    <BodyWrapper>
      <section className="max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 h-fit">

            <div className="text-sm text-gray-600">
              <p>
                Posted by <strong>Admin | Jennifer Ann</strong>
              </p>
              <p>On {displayDate}</p>
            </div>

            <div className="space-y-2">
              <a href="#intro" className="block bg-green-100 p-3 rounded-md text-sm hover:bg-green-200">
                Introduction
              </a>

              <a href="#value" className="block bg-green-100 p-3 rounded-md text-sm hover:bg-green-200">
                We value you
              </a>

              <a href="#boost" className="block bg-green-100 p-3 rounded-md text-sm hover:bg-green-200">
                Elevating Your Dishes
              </a>

              <a href="#contact" className="block bg-green-100 p-3 rounded-md text-sm hover:bg-green-200">
                Get In Touch
              </a>

              <a href="#comment" className="block bg-green-100 p-3 rounded-md text-sm hover:bg-green-200">
                Leave a Comment
              </a>
            </div>

          </aside>

          {/* Main Content */}
          <article className="space-y-6">

            <Suspense>
              <Image
                src={imageSrc}
                alt={post?.title}
                width={900}
                height={500}
                className="rounded-lg w-full object-cover"
              />
            </Suspense>

            <h1 className="max-w-4xl px-4">
               <BlogRenderer content={post?.content || ""} />
            </h1>

            {/* We value you */}
            <section id="value" className="space-y-3">
              <h2 className="font-semibold text-lg">We value you :</h2>
              <p className="text-gray-700 leading-7">
                We take pride in selecting a range of the finest quality,
                dehydrated produce to offer to the catering industry and others.
              </p>
            </section>

            {/* Boost section */}
            <section id="boost" className="space-y-3">
              <h2 className="font-semibold text-lg">
                Elevating Your Dishes with a Flavorful Boost :
              </h2>
              <p className="text-gray-700 leading-7">
                At Claire's Delight, we believe in the essence of simplicity when
                it comes to crafting exceptional meals. Our commitment to using
                only the purest natural seasonings ensures every dish is infused
                with fresh authentic flavors.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="space-y-3">
              <h2 className="font-semibold text-lg">Get in Touch with Us</h2>
              <p className="text-gray-700 leading-7">
                If you're looking to add some flavour to your menu,
                we can help you on your journey.
              </p>
            </section>

          </article>
        </div>
      </section>
    </BodyWrapper>
  );
}
