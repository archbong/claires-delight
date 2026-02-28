"use client";

import Loading from "@/app/loading";
import { Suspense, useEffect } from "react";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useProductsStore } from "@/app/store";
import EnhancedSpiceCard from "../Spice/EnhancedSpiceCard";

const Spice = () => {
  const products = useProductsStore((state) => state.products);

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <Title>{"Our Spice Collection"}</Title>
      <Paragraph>
        Explore our diverse spice collection sourced from around the globe,
        each ingredient carefully chosen for its exceptional quality and
        distinctive taste
      </Paragraph>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 mt-5 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {products.map((product: any) => (
            <EnhancedSpiceCard
              key={product._id}
              product={product}
              className="w-full max-w-sm"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center font-bold">
        <Link
          href="/shop-spices"
          className="text-orange hover:text-green flex items-center gap-1"
        >
          View All <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Spice;
