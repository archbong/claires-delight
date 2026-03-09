"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BodyWrapper from "@/app/components/layout/BodyWrapper";
import Pagination from "@/app/components/pagination/Pagination";
import PostCard from "@/app/components/blog/PostCard";
import { BlogPost } from "@/typings";
import Breadcrumb from "../Breadcrumb";

const ITEMS_PER_PAGE = 10;

export default function PostList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Unable to load blog posts right now.");
      }
      const data = (await res.json()) as BlogPost[];
      setPosts(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading blog posts.",
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(posts.length / ITEMS_PER_PAGE)),
    [posts.length],
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [posts, currentPage]);

  if (loading) {
    return (
      <BodyWrapper>
        <div className="py-10 text-center">
          <h2 className="text-xl font-semibold text-customBlack">Loading blog posts...</h2>
          <p className="text-tertiaryGrey mt-2">Fetching the latest updates for you.</p>
        </div>
      </BodyWrapper>
    );
  }

  if (error) {
    return (
      <BodyWrapper>
        <div className="max-w-xl mx-auto mt-10 p-6 border border-red-200 bg-red-50 rounded-xl text-center">
          <h2 className="text-lg font-semibold text-red-700">Could not load blog posts</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchPosts}
            className="btn mt-4 bg-orange hover:bg-green text-white border-none"
          >
            Retry
          </button>
        </div>
      </BodyWrapper>
    );
  }

  if (!posts.length) {
    return (
      <BodyWrapper>
        <div className="py-10 text-center">
          <h2 className="text-xl font-semibold text-customBlack">No blog posts yet</h2>
          <p className="text-tertiaryGrey mt-2">
            New articles will appear here once they are published.
          </p>
        </div>
      </BodyWrapper>
    );
  }

  return (
    <BodyWrapper>
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: "Trending" },
          { label: "ALL" },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {paginatedPosts.map((post: BlogPost) => (
          <Suspense key={post._id ?? post.slug}>
            <PostCard post={post} />
          </Suspense>
        ))}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
        onPreviousPage={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
      />
    </BodyWrapper>
  );
}
