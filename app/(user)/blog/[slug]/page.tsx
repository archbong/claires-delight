import BodyWrapper from "@/app/components/layout/BodyWrapper";
import Link from "next/link";
import Navbar from "@/app/components/header/navbar/Navbar";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import PostDetail from "@/app/components/blog/PostDetail";
import { getPost } from "@/lib/data";
import Breadcrumb from "@/app/components/Breadcrumb";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post?.title,
    description: post?.content,
  };
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <BodyWrapper>
          <p className="py-10 text-center">Blog post not found.</p>
        </BodyWrapper>
        <ResponsiveFooter />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <BodyWrapper>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <PostDetail post={post} />
      </BodyWrapper>
      <ResponsiveFooter />
    </>
  );
}
