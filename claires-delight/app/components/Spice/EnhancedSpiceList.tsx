"use client";

import { useDebouncedCallback } from "use-debounce";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import BodyWrapper from "@/app/components/layout/BodyWrapper";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import { IoSearch, IoGrid, IoList } from "react-icons/io5";
import Pagination from "@/app/components/pagination/Pagination";
import EnhancedSpiceCard from "@/app/components/Spice/EnhancedSpiceCard";
import { Product } from "@/typings";
import EnhancedProductFilter from "./EnhancedProductFilter";
import MobileFilterHeader from "./MobileFilterHeader";
import SpiceCardNotProduct from "./SpiceCardNotFound";
import ProductGridSkeleton from "./ProductGridSkeleton";
import { useProductsStore } from "@/app/store/productsStore";

const ITEMS_PER_PAGE = 12;

interface EnhancedSpiceListProps {
  initialView?: "grid" | "list";
  enableInfiniteScroll?: boolean;
}

const EnhancedSpiceList: React.FC<EnhancedSpiceListProps> = ({
  initialView = "grid",
  enableInfiniteScroll = false,
}) => {
  const products = useProductsStore((state) => state.products);
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const loading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const updateSearchTerm = useProductsStore((state) => state.updateSearchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  useEffect(() => {
    setFilteredProducts(products);
    setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [products]);

  const handleFilterChange = useCallback((newFiltered: Product[]) => {
    setFilteredProducts(newFiltered);
    setCurrentPage(1);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setAppliedFilters([]);
    setFilteredProducts(products);
  }, [products]);

  const handleRemoveFilter = useCallback((filterName: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f !== filterName));
  }, []);

  const handleOpenFilters = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

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

  const displayedProducts = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return memoizedProducts.slice(0, endIndex);
  }, [memoizedProducts, currentPage]);

  const hasMoreProducts = currentPage < totalPages && enableInfiniteScroll;

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <BodyWrapper>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {isMobile && (
          <MobileFilterHeader
            appliedFilters={appliedFilters}
            onClearAll={handleClearAllFilters}
            onRemoveFilter={handleRemoveFilter}
            onOpenFilters={handleOpenFilters}
            resultsCount={filteredProducts.length}
          />
        )}

        <div className="lg:w-64 flex-shrink-0">
          <EnhancedProductFilter
            onFilter={handleFilterChange}
            isMobile={isMobile}
            onClearAll={handleClearAllFilters}
          />
        </div>

        <div id="spices" className={`flex-1 pt-6 px-4 sm:px-6 lg:px-8 ${isMobile ? "mt-20" : ""}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <SpiceTitle title={`${isMobile ? "Spices" : "All Spices"} (${filteredProducts.length})`} />

            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode((prev) => (prev === "grid" ? "list" : "grid"))}
                className="p-2 rounded-lg border border-primaryGrey hover:border-green hover:bg-lighterGreen transition-colors duration-200"
                aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
              >
                {viewMode === "grid" ? (
                  <IoList className="w-5 h-5 text-tertiaryGrey" />
                ) : (
                  <IoGrid className="w-5 h-5 text-tertiaryGrey" />
                )}
              </button>

              <div className="relative" ref={searchRef}>
                {showSearchInput ? (
                  <div className="flex items-center relative">
                    <input
                      id="navbar-search-input"
                      type="text"
                      name="search"
                      className="w-40 sm:w-48 h-10 pl-4 pr-10 rounded-lg border border-secondaryGrey focus:outline-none focus:ring-2 focus:ring-green transition-all duration-200"
                      placeholder="Search spices..."
                      value={inputValue}
                      onChange={handleSearchChange}
                    />
                    <IoSearch className="absolute right-3 h-5 w-5 text-tertiaryGrey" />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(true)}
                    className="p-2 rounded-lg border border-primaryGrey hover:border-green hover:bg-lighterGreen transition-colors duration-200"
                    aria-label="Open search"
                  >
                    <IoSearch className="w-5 h-5 text-tertiaryGrey" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            {loading ? (
              <ProductGridSkeleton count={ITEMS_PER_PAGE} />
            ) : (
              <>
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                    {displayedProducts.length > 0 ? (
                      displayedProducts.map((product: Product) => (
                        <Suspense key={product._id} fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-80" />}>
                          <EnhancedSpiceCard product={product} className="h-full" />
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

                {viewMode === "list" && (
                  <div className="space-y-4">
                    {displayedProducts.length > 0 ? (
                      displayedProducts.map((product: Product) => (
                        <Suspense key={product._id} fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-32" />}>
                          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-primaryGrey hover:shadow-lg transition-all duration-300">
                            <EnhancedSpiceCard product={product} variant="list" className="w-full" />
                          </div>
                        </Suspense>
                      ))
                    ) : (
                      <SpiceCardNotProduct />
                    )}
                  </div>
                )}

                {enableInfiniteScroll && hasMoreProducts && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={async () => {
                        setIsLoadingMore(true);
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        setCurrentPage((prev) => prev + 1);
                        setIsLoadingMore(false);
                      }}
                      disabled={isLoadingMore}
                      className="btn bg-green hover:bg-orange text-white border-none min-w-32"
                    >
                      {isLoadingMore ? <span className="loading loading-spinner loading-sm" /> : "Load More"}
                    </button>
                  </div>
                )}

                {isLoadingMore && (
                  <div className="flex justify-center mt-6">
                    <div className="animate-pulse text-tertiaryGrey">Loading more products...</div>
                  </div>
                )}
              </>
            )}
          </div>

          {!enableInfiniteScroll && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
              onPreviousPage={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            />
          )}
        </div>
      </div>
    </BodyWrapper>
  );
};

export default EnhancedSpiceList;
