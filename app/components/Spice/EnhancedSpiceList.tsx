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
import { IoSearch, IoGrid, IoList, IoOptions } from "react-icons/io5";
import Pagination from "@/app/components/pagination/Pagination";
import EnhancedSpiceCard from "@/app/components/Spice/EnhancedSpiceCard";
import { Product } from "@/typings";
import EnhancedProductFilter from "./EnhancedProductFilter";
import MobileFilterHeader from "./MobileFilterHeader";
import SpiceCardNotProduct from "./SpiceCardNotFound";
import ProductGridSkeleton from "./ProductGridSkeleton";
import { useProductsStore } from "@/app/store/productsStore";
import { LuChefHat } from "react-icons/lu";
import Unavailable from "../Unavailable";

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
    return (
      <Unavailable itemType="spices" />
    );
  }

  return (
  <BodyWrapper>
    <div className="flex flex-col lg:flex-row px-5">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 justify-center">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <EnhancedProductFilter
              onFilter={handleFilterChange}
              isMobile={false}
              onClearAll={handleClearAllFilters}
            />
          </aside>

          {/* Main Content */}
          <main id="spices">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-customBlack">
                {isMobile ? "Spices" : "All Spices"} ({filteredProducts.length})
              </h2>

              <div className="flex items-center gap-3">
                <IoSearch className="text-xl cursor-pointer" />
                {/* Filter icon — mobile only */}
                {isMobile && (
                  <IoOptions
                    className="text-xl cursor-pointer"
                    onClick={handleOpenFilters}
                  />
                )}
              </div>
            </div>

            {/* Applied filters chips — mobile only */}
            {isMobile && appliedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {appliedFilters.map((filter) => (
                  <span
                    key={filter}
                    className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full"
                  >
                    {filter}
                    <button onClick={() => handleRemoveFilter(filter)}>
                      ✕
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearAllFilters}
                  className="text-sm text-red-500 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {displayedProducts.map((product: Product) => (
                <Suspense
                  key={product._id}
                  fallback={
                    <div className="animate-pulse bg-orange/10 rounded-2xl h-56" />
                  }
                >
                  <EnhancedSpiceCard product={product} />
                </Suspense>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>

    {/* Mobile Filter Drawer */}
    {isMobile && isFilterOpen && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
        {/* Drawer */}
        <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-xl overflow-y-auto p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Filter By</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500 text-2xl leading-none"
            >
              ✕
            </button>
          </div>
          <EnhancedProductFilter
            onFilter={handleFilterChange}
            isMobile={true}
            onClearAll={handleClearAllFilters}
          />
        </div>
      </>
    )}

    <div className="pt-5">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      />
    </div>
  </BodyWrapper>
);

};

export default EnhancedSpiceList;
