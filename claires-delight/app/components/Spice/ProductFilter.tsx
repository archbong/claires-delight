"use client";

import { useState, useEffect } from "react";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import ServiceCard from "@/app/components/LandingPage/our-service/ServiceCard";
import SpiceTitle from "@/app/components/Spice/SpiceTitle";
import { Product } from "@/typings";
import { useProductsStore } from "@/app/store/productsStore";

interface ProductFilterProps {
  onFilter: (filteredProducts: Product[]) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter }) => {
  const products = useProductsStore((state) => state.products);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isSingleSpiceChecked, setIsSingleSpiceChecked] = useState(false);
  const [isMixedSpiceChecked, setIsMixedSpiceChecked] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(false);
  const [bestSelling, setBestSelling] = useState(false);
  const [aToZ, setAToZ] = useState(false);
  const [zToA, setZToA] = useState(false);
  const [isLow, setIsLow] = useState(false);
  const [isHigh, setIsHigh] = useState(false);

  useEffect(() => {
    let filtered = [...products];

    if (isSingleSpiceChecked) {
      filtered = filtered.filter((product) =>
        product.category?.some((cat) => cat.title === "Single Spices")
      );
    }

    if (isMixedSpiceChecked) {
      filtered = filtered.filter((product) =>
        product.category?.some((cat) => cat.title === "Mixed Spices")
      );
    }

    if (recentlyAdded) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    if (bestSelling) {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    if (aToZ) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (zToA) {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (isLow) {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (isHigh) {
      filtered.sort((a, b) => b.price - a.price);
    }

    onFilter(filtered);
  }, [
    products,
    isSingleSpiceChecked,
    isMixedSpiceChecked,
    recentlyAdded,
    bestSelling,
    aToZ,
    zToA,
    isLow,
    isHigh,
    onFilter,
  ]);

  return (
    <div className="pt-[4rem]">
      <SpiceTitle title="Filter By" />
      <ServiceCard className="w-[25rem] h-[20rem] p-1">
        <SpiceTitle className="px-3" title="Category" />
        <div className="flex flex-row items-center p-2 gap-2">
          <button onClick={() => setIsAllChecked(!isAllChecked)}>
            {isAllChecked ? (
              <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
            ) : (
              <MdCheckBoxOutlineBlank className="w-8 h-8" />
            )}
          </button>
          <p>
            All <span>({products.length})</span>
          </p>
        </div>

        <div className="flex flex-row items-center p-2 gap-2">
          <button onClick={() => setIsSingleSpiceChecked(!isSingleSpiceChecked)}>
            {isSingleSpiceChecked ? (
              <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
            ) : (
              <MdCheckBoxOutlineBlank className="w-8 h-8" />
            )}
          </button>
          <p>Single Spices</p>
        </div>
        <div className="flex flex-row items-center p-2 gap-2">
          <button onClick={() => setIsMixedSpiceChecked(!isMixedSpiceChecked)}>
            {isMixedSpiceChecked ? (
              <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
            ) : (
              <MdCheckBoxOutlineBlank className="w-8 h-8" />
            )}
          </button>
          <p>Mixed Spices</p>
        </div>
      </ServiceCard>

      <div className="py-5">
        <ServiceCard className="w-[25rem] h-[25rem] p-1 roundex-xl">
          <SpiceTitle className="px-3" title="Sort" />
          <div className="flex flex-row items-center p-2 gap-2">
            <button onClick={() => setRecentlyAdded(!recentlyAdded)}>
              {recentlyAdded ? (
                <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
              ) : (
                <MdCheckBoxOutlineBlank className="w-8 h-8" />
              )}
            </button>
            <p>Recently Added</p>
          </div>
          <div className="flex flex-row items-center p-2 gap-2">
            <button onClick={() => setBestSelling(!bestSelling)}>
              {bestSelling ? (
                <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
              ) : (
                <MdCheckBoxOutlineBlank className="w-8 h-8" />
              )}
            </button>
            <p>Best Selling</p>
          </div>
          <div className="flex flex-row items-center p-2 gap-2">
            <button onClick={() => setAToZ(!aToZ)}>
              {aToZ ? (
                <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
              ) : (
                <MdCheckBoxOutlineBlank className="w-8 h-8" />
              )}
            </button>
            <p>Alphabetically, A - Z</p>
          </div>
          <div className="flex flex-row items-center p-2 gap-2">
            <button onClick={() => setZToA(!zToA)}>
              {zToA ? (
                <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
              ) : (
                <MdCheckBoxOutlineBlank className="w-8 h-8" />
              )}
            </button>
            <p>Alphabetically, Z - A</p>
          </div>
        </ServiceCard>
      </div>

      <div className="py-5">
        <ServiceCard className="w-[25rem] h-[20rem] py-3 px-1 rounded-xl">
          <SpiceTitle className="px-3" title="Price" />
          <div className="flex flex-row items-center p-2 gap-2">
            <button onClick={() => setIsLow(!isLow)}>
              {isLow ? (
                <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
              ) : (
                <MdCheckBoxOutlineBlank className="w-8 h-8" />
              )}
            </button>
            <p>Low to High</p>
          </div>
          <div className="flex flex-row items-center p-2 gap-2">
            <button onClick={() => setIsHigh(!isHigh)}>
              {isHigh ? (
                <IoMdCheckboxOutline className="w-8 h-8 text-orange" />
              ) : (
                <MdCheckBoxOutlineBlank className="w-8 h-8" />
              )}
            </button>
            <p>High to Low</p>
          </div>
        </ServiceCard>
      </div>
    </div>
  );
};

export default ProductFilter;
