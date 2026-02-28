"use client";

import { Product } from "@/typings";
import Link from "next/link";
import ResponsiveFooter from "../footer/responsive/ResponsiveFooter";
import Navbar from "../header/navbar/Navbar";
import BodyWrapper from "../layout/BodyWrapper";
import EnhancedSpiceCard from "./EnhancedSpiceCard";
import ProductFilter from "./ProductFilter";
import { useState } from "react";

const SearchProductResults = ({ results }: { results: Product[] }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(results);

  return (
    <div>
      <Navbar />
      <BodyWrapper>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/shop-spices">Shop Spices</Link>
            </li>
            <li>All Spices</li>
          </ul>
        </div>

        <h1 className="text-4xl font-bold py-8">
          Results ({filteredProducts.length})
        </h1>

        <h3 className="font-bold py-3">Filter By</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center">
          <ProductFilter onFilter={setFilteredProducts} />
          <div>
            {filteredProducts.map((result) => (
              <div
                key={result._id}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pb-5"
              >
                <EnhancedSpiceCard product={result} />
              </div>
            ))}
          </div>
        </div>
      </BodyWrapper>
      <ResponsiveFooter />
    </div>
  );
};

export default SearchProductResults;
