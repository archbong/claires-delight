"use client";

import { useDebouncedCallback } from "use-debounce";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import BodyWrapper from "@/app/components/layout/BodyWrapper";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import { IoSearch } from "react-icons/io5";
import Pagination from "@/app/components/pagination/Pagination";
import SpiceCard from "@/app/components/Spice/SpiceCard";
import { Product } from "@/typings";
import ProductFilter from "./ProductFilter";
import SpiceCardNotProduct from "./SpiceCardNotFound";
import ProductGridSkeleton from "./ProductGridSkeleton";
import { useProductsStore } from "@/app/store/productsStore";

const ITEMS_PER_PAGE = 12;

const SpiceList: React.FC = () => {
  const products = useProductsStore((state) => state.products);
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const updateSearchTerm = useProductsStore((state) => state.updateSearchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const searchRef = useRef<HTMLDivElement>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    setFilteredProducts(products);
    setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));
  }, [products]);

  const debouncedHandleSearchChange = useDebouncedCallback((value: string) => {
    updateSearchTerm(value);
    localStorage.setItem("searchTerm", value);

    if (!value.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = value.toLowerCase();
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newSearchTerm = event.target.value;
    setInputValue(newSearchTerm);
    debouncedHandleSearchChange(newSearchTerm);
  };

  const memoizedProducts = useMemo(() => filteredProducts, [filteredProducts]);

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return memoizedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <BodyWrapper>
      <div className="flex justify-center">
        <ProductFilter onFilter={setFilteredProducts} />
        <div className="pt-10 px-10">
          <div className="flex justify-between">
            <SpiceTitle title={`All Spice (${filteredProducts.length})`} />
            <div className="relative" ref={searchRef}>
              {showSearchInput ? (
                <div className="flex items-center relative">
                  <input
                    id="navbar-search-input"
                    type="text"
                    name="search"
                    className="w-[10rem] h-7 pl-3 pr-10 rounded-2xl grow border border-secondaryGrey focus:outline-none focus:ring-1 focus:ring-secondaryGrey transition"
                    placeholder="Search"
                    value={inputValue}
                    onChange={handleSearchChange}
                  />
                  <IoSearch className="absolute right-3 h-5 w-5" />
                </div>
              ) : (
                <IoSearch
                  className="text-[1.6rem] cursor-pointer transition-transform"
                  onClick={() => setShowSearchInput(true)}
                />
              )}
            </div>
          </div>

          <div className="mt-5 mb-16">
            {isLoading ? (
              <ProductGridSkeleton count={ITEMS_PER_PAGE} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {getPaginatedProducts().length > 0 ? (
                  getPaginatedProducts().map((product: Product) => (
                    <Suspense key={product._id}>
                      <SpiceCard product={product} className="h-full" />
                    </Suspense>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Suspense>
                      <SpiceCardNotProduct />
                    </Suspense>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, totalPages)}
        onNextPage={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
        onPreviousPage={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
      />
    </BodyWrapper>
  );
};

export default SpiceList;
