"use client";

import { useState, useEffect } from "react";
import { IoMdCheckboxOutline, IoMdClose } from "react-icons/io";
import { MdCheckBoxOutlineBlank, MdFilterList } from "react-icons/md";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import ServiceCard from "@/app/components/LandingPage/our-service/ServiceCard";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import { Category, Product } from "@/typings";
import { useProductsStore } from "@/app/store";

interface EnhancedProductFilterProps {
  onFilter: (filteredProducts: Product[]) => void;
  isMobile?: boolean;
  onClearAll?: () => void;
}

interface FilterState {
  category: {
    all: boolean;
    singleSpices: boolean;
    mixedSpices: boolean;
  };
  sort: {
    recentlyAdded: boolean;
    bestSelling: boolean;
    aToZ: boolean;
    zToA: boolean;
  };
  price: {
    lowToHigh: boolean;
    highToLow: boolean;
  };
}

const EnhancedProductFilter: React.FC<EnhancedProductFilterProps> = ({
  onFilter,
  isMobile = false,
  onClearAll,
}) => {
  const products = useProductsStore((state) => state.products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    category: {
      all: false,
      singleSpices: false,
      mixedSpices: false,
    },
    sort: {
      recentlyAdded: false,
      bestSelling: false,
      aToZ: false,
      zToA: false,
    },
    price: {
      lowToHigh: false,
      highToLow: false,
    },
  });

  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  // Calculate product counts
  const singleSpiceCount = products.filter((product) =>
    product.category?.some((cat) => cat.title === "Single Spices"),
  ).length;

  const mixedSpiceCount = products.filter((product) =>
    product.category?.some((cat) => cat.title === "Mixed Spices"),
  ).length;

  useEffect(() => {
    let filtered = [...products];
    const { category, sort, price } = filterState;

    // Category filtering
    if (category.singleSpices) {
      filtered = filtered.filter((product) =>
        product.category?.some((cat) => cat.title === "Single Spices"),
      );
    }

    if (category.mixedSpices) {
      filtered = filtered.filter((product) =>
        product.category?.some((cat) => cat.title === "Mixed Spices"),
      );
    }

    // Sorting
    if (sort.recentlyAdded) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    if (sort.aToZ) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort.zToA) {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (price.lowToHigh) {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (price.highToLow) {
      filtered.sort((a, b) => b.price - a.price);
    }

    onFilter(filtered);

    // Update applied filters for display
    const newAppliedFilters: string[] = [];
    if (category.singleSpices) newAppliedFilters.push("Single Spices");
    if (category.mixedSpices) newAppliedFilters.push("Mixed Spices");
    if (sort.recentlyAdded) newAppliedFilters.push("Recently Added");
    if (sort.aToZ) newAppliedFilters.push("A-Z");
    if (sort.zToA) newAppliedFilters.push("Z-A");
    if (price.lowToHigh) newAppliedFilters.push("Low to High");
    if (price.highToLow) newAppliedFilters.push("High to Low");

    setAppliedFilters(newAppliedFilters);
  }, [products, filterState, onFilter]);

  const toggleFilter = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleFilterChange = (
    type: keyof FilterState,
    key: string,
    value: boolean,
  ) => {
    setFilterState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  const clearAllFilters = () => {
    setFilterState({
      category: {
        all: false,
        singleSpices: false,
        mixedSpices: false,
      },
      sort: {
        recentlyAdded: false,
        bestSelling: false,
        aToZ: false,
        zToA: false,
      },
      price: {
        lowToHigh: false,
        highToLow: false,
      },
    });
    setAppliedFilters([]);

    if (onClearAll) {
      onClearAll();
    }
  };

  const removeFilter = (filterName: string) => {
    const newFilterState = { ...filterState };

    // Remove category filters
    if (filterName === "Single Spices") {
      newFilterState.category.singleSpices = false;
    } else if (filterName === "Mixed Spices") {
      newFilterState.category.mixedSpices = false;
    }

    // Remove sort filters
    else if (filterName === "Recently Added") {
      newFilterState.sort.recentlyAdded = false;
    } else if (filterName === "A-Z") {
      newFilterState.sort.aToZ = false;
    } else if (filterName === "Z-A") {
      newFilterState.sort.zToA = false;
    }

    // Remove price filters
    else if (filterName === "Low to High") {
      newFilterState.price.lowToHigh = false;
    } else if (filterName === "High to Low") {
      newFilterState.price.highToLow = false;
    }

    setFilterState(newFilterState);

    // Update applied filters after removal
    const updatedFilters = appliedFilters.filter((f) => f !== filterName);
    setAppliedFilters(updatedFilters);
  };

  // Mobile Filter Drawer
  const FilterDrawer = () => (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsFilterOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b border-primaryGrey">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-20">
          <DesktopFilterContent />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-primaryGrey">
          <button
            onClick={clearAllFilters}
            className="w-full py-3 px-4 border border-orange text-orange rounded-lg hover:bg-orange hover:text-white transition-colors mb-2"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full py-3 px-4 bg-green text-white rounded-lg hover:bg-orange transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop Filter Content (reusable for mobile drawer)
  const DesktopFilterContent = () => (
    <div className="space-y-6">
      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="bg-lighterGreen p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Applied Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-primaryGrey"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="text-tertiaryGrey hover:text-red"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-orange text-sm hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Category Section */}
      <div className="border border-primaryGrey rounded-lg">
        <button
          className="w-full p-4 flex items-center justify-between hover:bg-lighterGreen transition-colors"
          onClick={() => toggleFilter("category")}
        >
          <span className="font-semibold">Category</span>
          {activeSection === "category" ? (
            <FiChevronUp className="w-5 h-5" />
          ) : (
            <FiChevronDown className="w-5 h-5" />
          )}
        </button>
        {activeSection === "category" && (
          <div className="p-4 border-t border-primaryGrey space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange(
                    "category",
                    "all",
                    !filterState.category.all,
                  )
                }
                className="flex-shrink-0"
              >
                {filterState.category.all ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">All ({products.length})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange(
                    "category",
                    "singleSpices",
                    !filterState.category.singleSpices,
                  )
                }
                className="flex-shrink-0"
              >
                {filterState.category.singleSpices ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">
                Single Spices ({singleSpiceCount})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange(
                    "category",
                    "mixedSpices",
                    !filterState.category.mixedSpices,
                  )
                }
                className="flex-shrink-0"
              >
                {filterState.category.mixedSpices ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">Mixed Spices ({mixedSpiceCount})</span>
            </div>
          </div>
        )}
      </div>

      {/* Sort Section */}
      <div className="border border-primaryGrey rounded-lg">
        <button
          className="w-full p-4 flex items-center justify-between hover:bg-lighterGreen transition-colors"
          onClick={() => toggleFilter("sort")}
        >
          <span className="font-semibold">Sort By</span>
          {activeSection === "sort" ? (
            <FiChevronUp className="w-5 h-5" />
          ) : (
            <FiChevronDown className="w-5 h-5" />
          )}
        </button>
        {activeSection === "sort" && (
          <div className="p-4 border-t border-primaryGrey space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange(
                    "sort",
                    "recentlyAdded",
                    !filterState.sort.recentlyAdded,
                  )
                }
                className="flex-shrink-0"
              >
                {filterState.sort.recentlyAdded ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">Recently Added</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange("sort", "aToZ", !filterState.sort.aToZ)
                }
                className="flex-shrink-0"
              >
                {filterState.sort.aToZ ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">Alphabetically, A-Z</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange("sort", "zToA", !filterState.sort.zToA)
                }
                className="flex-shrink-0"
              >
                {filterState.sort.zToA ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">Alphabetically, Z-A</span>
            </div>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="border border-primaryGrey rounded-lg">
        <button
          className="w-full p-4 flex items-center justify-between hover:bg-lighterGreen transition-colors"
          onClick={() => toggleFilter("price")}
        >
          <span className="font-semibold">Price</span>
          {activeSection === "price" ? (
            <FiChevronUp className="w-5 h-5" />
          ) : (
            <FiChevronDown className="w-5 h-5" />
          )}
        </button>
        {activeSection === "price" && (
          <div className="p-4 border-t border-primaryGrey space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange(
                    "price",
                    "lowToHigh",
                    !filterState.price.lowToHigh,
                  )
                }
                className="flex-shrink-0"
              >
                {filterState.price.lowToHigh ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">Low to High</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleFilterChange(
                    "price",
                    "highToLow",
                    !filterState.price.highToLow,
                  )
                }
                className="flex-shrink-0"
              >
                {filterState.price.highToLow ? (
                  <IoMdCheckboxOutline className="w-5 h-5 text-orange" />
                ) : (
                  <MdCheckBoxOutlineBlank className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">High to Low</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      {!isMobile && (
        <div className="hidden lg:block">
          <DesktopFilterContent />
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {isFilterOpen && <FilterDrawer />}
    </>
  );
};

export default EnhancedProductFilter;
