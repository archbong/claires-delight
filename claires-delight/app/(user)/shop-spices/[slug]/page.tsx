import BodyWrapper from "@/app/components/layout/BodyWrapper";
import Link from "next/link";
import { getSpice } from "@/lib/data";
import SpiceDetailCard from "@/app/components/Spice/SpiceDetailCard";
import Navbar from "@/app/components/header/navbar/Navbar";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import Breadcrumb from "@/app/components/Breadcrumb";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const spice = await getSpice(slug);

  if (!spice) {
    return {
      title: "Spice Not Found",
      description: "The spice you are looking for does not exist.",
    };
  }
  return {
    title: spice.name,
    description: spice.description,
  };
};

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  const renderStateCard = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div className="max-w-2xl mx-auto">
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link href="/shop-spices">Shop Spices</Link>
          </li>
          <li>All Spices</li>
          <li>{title}</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-primaryGrey bg-gradient-to-b from-[#FFF8F6] to-white p-8 md:p-10 shadow-sm text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-customBlack mb-3">
          {title}
        </h1>
        <p className="text-tertiaryGrey mb-8 max-w-xl mx-auto">{description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop-spices"
            className="btn bg-orange hover:bg-green text-white border-none min-w-40"
          >
            Browse Spices
          </Link>
          <Link
            href="/"
            className="btn btn-outline border-primaryGrey text-customBlack hover:bg-lighterGreen min-w-40"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );

  let spice;
  try {
    spice = await getSpice(slug);
  } catch (error) {
    console.error(error);
    return (
      <>
        <Navbar />
        <BodyWrapper>
          {renderStateCard({
            title: "Error Loading Spice",
            description:
              "We could not load this spice right now. Please refresh or try another item.",
          })}
        </BodyWrapper>
        <ResponsiveFooter />
      </>
    );
  }

  if (!spice) {
    return (
      <>
        <Navbar />
        <BodyWrapper>
          {renderStateCard({
            title: "Spice Not Found",
            description:
              "The spice you are looking for does not exist or may have been removed.",
          })}
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
            { label: "Shop Spices", href: "/shop-spices" },
            { label: "All Spices", href: "/shop-spices" },
            { label: spice?.name ?? "Spice Detail" },
          ]}
        />

        <div className="flex justify-center">
          <SpiceDetailCard item={spice} />
        </div>
      </BodyWrapper>
      <ResponsiveFooter />
    </>
  );
}
