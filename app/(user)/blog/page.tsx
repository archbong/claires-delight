"use client";

import ErrorBoundary from "@/app/components/ErrorBoundary";
import PostList from "@/app/components/blog/PostList";
import SearchProductResults from "@/app/components/Spice/SearchProductResult";
import Navbar from "@/app/components/header/navbar/Navbar";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import { useProductsStore } from "@/app/store/productsStore";

export default function Page() {
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const searchResults = useProductsStore((state) => state.filteredProducts);
  const setSearchTerm = useProductsStore((state) => state.setSearchTerm);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      {searchTerm ? (
        <SearchProductResults results={searchResults} />
      ) : (
        <ErrorBoundary>
          <PostList />
        </ErrorBoundary>
      )}
      <ResponsiveFooter />
    </>
  );
}
