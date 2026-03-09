"use client";

import { useState, useEffect } from "react";
import { IoMdCheckboxOutline, IoMdClose } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { Product } from "@/typings";
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
    dateOldToNew: boolean;
    dateNewToOld: boolean;
  };
  price: {
    all: boolean;
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
  const [filterState, setFilterState] = useState<FilterState>({
    category: { all: false, singleSpices: false, mixedSpices: false },
    sort: {
      recentlyAdded: false,
      bestSelling: false,
      aToZ: false,
      zToA: false,
      dateOldToNew: false,
      dateNewToOld: false,
    },
    price: { all: false, lowToHigh: false, highToLow: false },
  });

  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  const singleSpiceCount = products.filter((p) =>
    p.category?.some((cat) => cat.title === "Single Spices")
  ).length;

  const mixedSpiceCount = products.filter((p) =>
    p.category?.some((cat) => cat.title === "Mixed Spices")
  ).length;

  useEffect(() => {
    let filtered = [...products];
    const { category, sort, price } = filterState;

    if (category.singleSpices) {
      filtered = filtered.filter((p) =>
        p.category?.some((cat) => cat.title === "Single Spices")
      );
    }
    if (category.mixedSpices) {
      filtered = filtered.filter((p) =>
        p.category?.some((cat) => cat.title === "Mixed Spices")
      );
    }
    if (sort.recentlyAdded) {
      filtered.sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    if (sort.aToZ) filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort.zToA) filtered.sort((a, b) => b.name.localeCompare(a.name));
    if (sort.dateOldToNew) {
      filtered.sort((a, b) =>
        new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
      );
    }
    if (sort.dateNewToOld) {
      filtered.sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    if (price.lowToHigh) filtered.sort((a, b) => a.price - b.price);
    if (price.highToLow) filtered.sort((a, b) => b.price - a.price);

    onFilter(filtered);

    const newAppliedFilters: string[] = [];
    if (category.singleSpices) newAppliedFilters.push("Single Spices");
    if (category.mixedSpices) newAppliedFilters.push("Mixed Spices");
    if (sort.recentlyAdded) newAppliedFilters.push("Recently Added");
    if (sort.aToZ) newAppliedFilters.push("A-Z");
    if (sort.zToA) newAppliedFilters.push("Z-A");
    if (sort.dateOldToNew) newAppliedFilters.push("Date, old to new");
    if (sort.dateNewToOld) newAppliedFilters.push("Date, new to old");
    if (price.lowToHigh) newAppliedFilters.push("Low to High");
    if (price.highToLow) newAppliedFilters.push("High to Low");
    setAppliedFilters(newAppliedFilters);
  }, [products, filterState, onFilter]);

  const handleFilterChange = (
    type: keyof FilterState,
    key: string,
    value: boolean
  ) => {
    setFilterState((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
  };

  const clearAllFilters = () => {
    setFilterState({
      category: { all: false, singleSpices: false, mixedSpices: false },
      sort: {
        recentlyAdded: false,
        bestSelling: false,
        aToZ: false,
        zToA: false,
        dateOldToNew: false,
        dateNewToOld: false,
      },
      price: { all: false, lowToHigh: false, highToLow: false },
    });
    setAppliedFilters([]);
    onClearAll?.();
  };

  const removeFilter = (filterName: string) => {
    const s = { ...filterState };
    if (filterName === "Single Spices") s.category.singleSpices = false;
    else if (filterName === "Mixed Spices") s.category.mixedSpices = false;
    else if (filterName === "Recently Added") s.sort.recentlyAdded = false;
    else if (filterName === "A-Z") s.sort.aToZ = false;
    else if (filterName === "Z-A") s.sort.zToA = false;
    else if (filterName === "Date, old to new") s.sort.dateOldToNew = false;
    else if (filterName === "Date, new to old") s.sort.dateNewToOld = false;
    else if (filterName === "Low to High") s.price.lowToHigh = false;
    else if (filterName === "High to Low") s.price.highToLow = false;
    setFilterState(s);
    setAppliedFilters((prev) => prev.filter((f) => f !== filterName));
  };

  // Reusable checkbox row
  const CheckboxRow = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <div
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={onChange}
    >
      {checked ? (
        <IoMdCheckboxOutline className="w-5 h-5 text-orange flex-shrink-0" />
      ) : (
        <MdCheckBoxOutlineBlank className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
      <span className="text-sm text-customBlack">{label}</span>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-4 w-full">
      {/* Category */}
      <div className="border border-primaryGrey/60 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-base text-customBlack">Category</h4>
        <CheckboxRow
          checked={filterState.category.all}
          onChange={() =>
            handleFilterChange("category", "all", !filterState.category.all)
          }
          label={`All (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.category.singleSpices}
          onChange={() =>
            handleFilterChange(
              "category",
              "singleSpices",
              !filterState.category.singleSpices
            )
          }
          label={`Single Spices (${singleSpiceCount})`}
        />
        <CheckboxRow
          checked={filterState.category.mixedSpices}
          onChange={() =>
            handleFilterChange(
              "category",
              "mixedSpices",
              !filterState.category.mixedSpices
            )
          }
          label={`Mixed Spices (${mixedSpiceCount})`}
        />
      </div>

      {/* Sort */}
      <div className="border border-primaryGrey/60 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-base text-customBlack">Sort</h4>
        <CheckboxRow
          checked={filterState.sort.recentlyAdded}
          onChange={() =>
            handleFilterChange(
              "sort",
              "recentlyAdded",
              !filterState.sort.recentlyAdded
            )
          }
          label={`Recently Added (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.sort.bestSelling}
          onChange={() =>
            handleFilterChange(
              "sort",
              "bestSelling",
              !filterState.sort.bestSelling
            )
          }
          label={`Best Selling (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.sort.aToZ}
          onChange={() =>
            handleFilterChange("sort", "aToZ", !filterState.sort.aToZ)
          }
          label={`Alphabetically, A - Z (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.sort.zToA}
          onChange={() =>
            handleFilterChange("sort", "zToA", !filterState.sort.zToA)
          }
          label={`Alphabetically, Z - A (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.sort.dateOldToNew}
          onChange={() =>
            handleFilterChange(
              "sort",
              "dateOldToNew",
              !filterState.sort.dateOldToNew
            )
          }
          label={`Date, old to new (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.sort.dateNewToOld}
          onChange={() =>
            handleFilterChange(
              "sort",
              "dateNewToOld",
              !filterState.sort.dateNewToOld
            )
          }
          label={`Date, new to old (${products.length})`}
        />
      </div>

      {/* Price */}
      <div className="border border-primaryGrey/60 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-base text-customBlack">Price</h4>
        <CheckboxRow
          checked={filterState.price.all}
          onChange={() =>
            handleFilterChange("price", "all", !filterState.price.all)
          }
          label={`All (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.price.lowToHigh}
          onChange={() =>
            handleFilterChange(
              "price",
              "lowToHigh",
              !filterState.price.lowToHigh
            )
          }
          label={`Low to High (${products.length})`}
        />
        <CheckboxRow
          checked={filterState.price.highToLow}
          onChange={() =>
            handleFilterChange(
              "price",
              "highToLow",
              !filterState.price.highToLow
            )
          }
          label={`High to Low (${products.length})`}
        />
      </div>
    </div>
  );

  // Mobile Drawer
  const FilterDrawer = () => (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsFilterOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-4 border-b border-primaryGrey flex items-center justify-between">
          <h3 className="font-bold text-lg text-customBlack">Filter By</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <IoMdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Applied filters */}
        {appliedFilters.length > 0 && (
          <div className="px-4 pt-3 flex flex-wrap gap-2">
            {appliedFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 bg-orange/10 text-orange px-3 py-1 rounded-full text-xs"
              >
                {filter}
                <button onClick={() => removeFilter(filter)}>
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-orange text-xs hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="p-4 overflow-y-auto h-full pb-32">
          <FilterContent />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-primaryGrey space-y-2">
          <button
            onClick={clearAllFilters}
            className="w-full py-3 border border-orange text-orange rounded-lg hover:bg-orange hover:text-white transition-colors text-sm font-medium"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full py-3 bg-green text-white rounded-lg hover:bg-orange transition-colors text-sm font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      {!isMobile && (
        <div className="hidden lg:block">
          <h3 className="font-bold text-lg text-customBlack mb-4">Filter By</h3>
          <FilterContent />
        </div>
      )}

      {/* Mobile Drawer */}
      {isFilterOpen && <FilterDrawer />}
    </>
  );
};

export default EnhancedProductFilter;