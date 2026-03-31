"use client";

import { spiceBanner } from "@/public/image/cdn/cdn";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import Navbar from "@/app/components/header/navbar/Navbar";
import EnhancedSpiceList from "@/app/components/Spice/EnhancedSpiceList";
import SearchProductResults from "@/app/components/Spice/SearchProductResult";
import { useProductsStore } from "@/app/store/productsStore";
import { searchProducts } from "@/lib/searchUtils";
import Banner from "@/app/components/banner/Banner";
import { useEffect } from "react";

export default function Page() {
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const products = useProductsStore((state) => state.products);
  const setSearchTerm = useProductsStore((state) => state.setSearchTerm);

  const searchResults = searchTerm ? searchProducts(products, searchTerm) : products;

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  console.log("Search Term:", searchTerm);
  console.log("Search Results:", searchResults);

  return (
    <>
      <Navbar onSearch={handleSearch} />
      {searchTerm ? (
        <SearchProductResults results={searchResults} />
      ) : (
        <>
         
          <Banner
            image={spiceBanner}
            title={`Shop Spices`}
            subtitle={`Check out our spice shop for all your cooking needs.
               Find the perfect flavors to make your meals delicious.`}
            />
          <ErrorBoundary>
            <EnhancedSpiceList enableInfiniteScroll={true} />
          </ErrorBoundary>
        </>
      )}
      <ResponsiveFooter />
    </>
  );
}
