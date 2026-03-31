"use client";

import { Product } from "@/typings";
import Link from "next/link";
import ResponsiveFooter from "../footer/responsive/ResponsiveFooter";
import BodyWrapper from "../layout/BodyWrapper";
import EnhancedSpiceCard from "./EnhancedSpiceCard";
import EnhancedProductFilter from "./EnhancedProductFilter";
import { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb";
import { useProductsStore } from "@/app/store/productsStore";

const SearchProductResults = ({ results }: { results: Product[] }) => {
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(results);
  useEffect(() => { setFilteredProducts(results); }, [results]);

  return (
    <div>
      <BodyWrapper>
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Shop Spices", href: "/shop-spices" },
          { label: "Search", href: "/shop-spices/search" },
          { label: searchTerm, href: "#" },
        ]} />

        {/* Results heading */}
        <h1 className="text-2xl font-bold py-5">
          Results for {searchTerm} ({filteredProducts.length})
        </h1>

        <div className="flex flex-col lg:flex-row px-5">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 justify-center">

              <aside className="hidden lg:block">
                <EnhancedProductFilter
                  onFilter={setFilteredProducts}
                  isMobile={false}
                  onClearAll={() => setFilteredProducts(results)}
                />
              </aside>

              <main id="spices">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg text-customBlack">
                    {filteredProducts.length > 0
                      ? `Search Results (${filteredProducts.length})`
                      : "No Results"}
                  </h2>
                </div>

                {filteredProducts.length === 0 ? (
                  <p className="text-gray-500">No results found for "{searchTerm}".</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                    {filteredProducts.map((result) => (
                      <EnhancedSpiceCard key={result._id} product={result} />
                    ))}
                  </div>
                )}
              </main>

            </div>
          </div>
        </div>
      </BodyWrapper>
      <ResponsiveFooter />
    </div>
  );
};

export default SearchProductResults;
