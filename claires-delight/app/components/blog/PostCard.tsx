import Loading from "@/app/loading";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import BlogRenderer from "./BlogRender";

interface PostAuthor {
  firstname?: string;
  lastname?: string;
  username?: string;
}

interface PostCardItem {
  _id?: string;
  slug?: string;
  title: string;
  content: string;
  featuredImage?: string | null;
  author?: string | PostAuthor;
  createdAt?: string;
}

export default function PostCard({ post }: { post: PostCardItem }) {
  const imageSrc =
    typeof post?.featuredImage === "string" &&
      post.featuredImage.trim() !== "" &&
      post.featuredImage !== "null" &&
      post.featuredImage !== "undefined"
      ? post.featuredImage
      : "/placeholder.svg";

  const authorName =
    typeof post?.author === "string"
      ? post.author
      : post?.author?.firstname && post?.author?.lastname
        ? `${post.author.firstname} ${post.author.lastname}`
        : post?.author?.username ?? "Admin";

  // Format the createdAt date
  const createdAtDate = new Date(post.createdAt ?? new Date().toISOString());
  const formattedDate = `${createdAtDate.getDate()} ${createdAtDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${createdAtDate.getFullYear()}`;
  return (
    <div className="w-full max-w-md rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <figure className="w-full h-[260px] relative">
        <Suspense fallback={<Loading />}>
          <Image
            src={imageSrc}
            alt={post?.title}
            fill
            className="object-cover rounded-t-3xl"
            sizes="(max-width:768px) 100vw, 400px"
          />
        </Suspense>
      </figure>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">

        {/* Title */}
        {/* <h2 className="text-xl font-bold text-gray-900 leading-snug">
          {post?.title}
        </h2> */}

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          <BlogRenderer content={post?.content || ""} />
        </p>

        {/* Read More */}
        <Link
          href={`/blog/${post?.slug}`}
          className="text-orange-500 font-semibold hover:underline"
        >
          Read More
        </Link>

        {/* Footer */}
        <div className="flex items-end justify-between pt-2">

          {/* Author + likes */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaUser />
            <span>by {authorName}</span>

            <BiSolidLike className="ml-2" />
            <span>0</span>
          </div>

          {/* Date */}
          <div className="text-center">
            <p className="text-lg font-bold leading-none">
              {formattedDate.split(" ")[0]}
            </p>
            <p className="text-[10px] text-gray-500 uppercase leading-none tracking-wide">
              {formattedDate.split(" ").slice(1).join(" ")}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
