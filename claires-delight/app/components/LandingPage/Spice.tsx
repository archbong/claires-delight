"use client";

import { Suspense } from "react";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";
import EnhancedSpiceCard from "../Spice/EnhancedSpiceCard";
import { useProductsStore } from "@/app/store";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const Spice = () => {
   const products = useProductsStore((state) => state.products);
  
    if (!Array.isArray(products) || products.length === 0) {
      return null;
    }
 
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div className="lg:mt-16 md:mt-16 mt-16">
      <Title>{"Our Spice Collection"} </Title>
      <Paragraph>
        {
          "Explore our diverse spice collection sourced from around the globe, each ingredient carefully chosen for its exceptional quality and distinctive taste"
        }
      </Paragraph>
      <div className="flex justify-center md:px-10 lg:px-10 md:mt-5 lg:mt-5 md:mb-16 lg:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 12).map((product: any) => (
            <Suspense key={product._id}>
              <EnhancedSpiceCard product={product} />
            </Suspense>
          ))}
        </div>
      </div>
      <div className="flex justify-center font-bold p-5">
        <Link
          href="/shop-spices"
          className="text-orange hover:text-green flex items-center gap-1"
        >
          {" "}
          View All <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Spice;
