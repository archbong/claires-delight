"use client";

import Image from "next/image";
import { Suspense } from "react";
import BodyWrapper from "@/app/components/layout/BodyWrapper";

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
      <section className="rounded-3xl border border-primaryGrey/60 bg-white/90 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:sticky lg:top-24 h-fit space-y-3">
            <div className="rounded-2xl bg-[#FFF8F6] border border-primaryGrey/40 p-4">
              <p className="text-xs uppercase tracking-wide text-tertiaryGrey">Posted by</p>
              <p className="font-semibold text-customBlack mt-1">Admin</p>
              <p className="text-sm text-tertiaryGrey mt-1">{displayDate}</p>
            </div>

            <div className="rounded-2xl bg-[#F6FFE9] border border-primaryGrey/30 p-4">
              <p className="text-lg font-semibold text-customBlack">In this article</p>
              <div className="mt-3 space-y-2 text-sm text-customBlack">
                <p className="rounded-lg bg-white border border-primaryGrey/30 px-3 py-2">Introduction</p>
                <p className="rounded-lg bg-white border border-primaryGrey/30 px-3 py-2">Why it matters</p>
                <p className="rounded-lg bg-white border border-primaryGrey/30 px-3 py-2">Practical tips</p>
                <p className="rounded-lg bg-white border border-primaryGrey/30 px-3 py-2">Contact us</p>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-primaryGrey/40">
              <Suspense>
                <Image
                  src={imageSrc}
                  alt={post?.title}
                  width={1200}
                  height={640}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </Suspense>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold text-customBlack mt-6">{post?.title}</h1>
            <p className="mt-5 text-base sm:text-lg leading-8 text-tertiaryGrey whitespace-pre-line">
              {post?.content}
            </p>

            <div className="mt-10 rounded-2xl border border-primaryGrey/50 bg-[#FFF8F6] p-5 sm:p-6">
              <h3 className="text-2xl font-bold text-customBlack">Get In Touch With Us</h3>
              <p className="mt-3 leading-7 text-tertiaryGrey">
                If you’re looking to add some flavour to your menu, We can help you on your journey.
                For more information about our services and what we can offer you, contact us at{" "}
                <span className="text-orange font-semibold">jebeyin4real@gmail.com</span> or call{" "}
                <span className="text-orange font-semibold">08070664809 / 08038353986</span>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </BodyWrapper>
  );
}
