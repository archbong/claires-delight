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
  <div className="flex flex-col lg:flex-row items-start gap-8">

    {isMobile && (
      <MobileFilterHeader
        appliedFilters={appliedFilters}
        onClearAll={handleClearAllFilters}
        onRemoveFilter={handleRemoveFilter}
        onOpenFilters={handleOpenFilters}
        resultsCount={filteredProducts.length}
      />
    )}

    {/* Sidebar */}
    <div className="lg:w-[260px] xl:w-[280px] flex-shrink-0">
      <EnhancedProductFilter
        onFilter={handleFilterChange}
        isMobile={isMobile}
        onClearAll={handleClearAllFilters}
      />
    </div>

    {/* Main content */}
    <div id="spices" className={`flex-1 ${isMobile ? "mt-20" : ""}`}>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-customBlack">
          {isMobile ? "Spices" : "All Spices"} ({filteredProducts.length})
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProducts.map((product: Product) => (
          <Suspense
            key={product._id}
            fallback={<div className="animate-pulse bg-orange/10 rounded-2xl h-56" />}
          >
            <EnhancedSpiceCard product={product} />
          </Suspense>
        ))}
      </div>

    </div>
  </div>
</BodyWrapper>
);
};

export default EnhancedSpiceList;
