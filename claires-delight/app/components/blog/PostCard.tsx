import Loading from "@/app/loading";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";

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
    <div className="card w-full h-full bg-base-100 shadow-xl rounded-3xl overflow-hidden">
      <Suspense fallback={<Loading />}>
        <figure>
          <Image
            src={imageSrc}
            alt={post?.title}
            width={500}
            height={500}
            loading="lazy"
            className="rounded-t-3xl"
          />
        </figure>
      </Suspense>
      <div className="p-5">
        <SpiceTitle title={post?.title} />
        <p className="line-clamp-4">{post?.content}</p>
        <p className="text-orange py-2">
          <Link href={`/blog/${post?.slug}`}>Read more</Link>
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-row justify-center items-center gap-1 text-teritaryGrey font-bold">
            <FaUser />
            <p>{authorName}</p>
            <button>
              <BiSolidLike />
            </button>
            <p>{0}</p>
          </div>

          <div className="flex flex-col justify-center items-center">
            <span className="font-bolder text-3xl">{createdAtDate.getDate()}</span>
            <p className="text-teritaryGrey">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
