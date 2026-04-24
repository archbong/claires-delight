"use client";

import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "@/app/store/cartStore";

interface CartCounterProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CartCounter({
  className = "",
  showText = false,
  size = "md",
}: CartCounterProps) {
  const cartCount = useCartStore((state) => state.cartCount);
  const items = useCartStore((state) => state.items);

  const [isAnimating, setIsAnimating] = useState(false);
  const [prevItemsLength, setPrevItemsLength] = useState(items.length);

  useEffect(() => {
    if (items.length > prevItemsLength) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
    setPrevItemsLength(items.length);
  }, [items.length, prevItemsLength]);

  const iconSizes = {
    sm: 18,
    md: 20,
    lg: 24,
  };

  const badgeSizes = {
    sm: "min-w-[14px] h-[14px] text-[9px]",
    md: "min-w-[16px] h-[16px] text-[10px]",
    lg: "min-w-[18px] h-[18px] text-[11px]",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <FiShoppingCart
          size={iconSizes[size]}
          className={`text-customBlack transition-transform duration-200 ${
            isAnimating ? "scale-110 text-green" : ""
          }`}
        />

        {cartCount > 0 && (
          <span
            className={`
              absolute -top-1 -right-1
              flex items-center justify-center
              px-[3px]
              rounded-full
              bg-lime-500 text-white font-semibold leading-none
              transition-all duration-300
              ${badgeSizes[size]}
              ${isAnimating ? "scale-125" : ""}
            `}
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </div>

      {showText && (
        <span className="ml-2 text-sm font-medium text-customBlack hidden sm:inline">
          Cart ({cartCount})
        </span>
      )}
    </div>
  );
}