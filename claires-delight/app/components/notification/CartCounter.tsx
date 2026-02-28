// Kiro Requirement: 4.1, 4.2, 4.3, 4.4 - Enhanced User Experience
// Kiro Requirement: 6.1 - Enhanced Add-to-Cart Experience
// Kiro Requirement: 7.1, 7.2, 7.3 - Animations and Micro-interactions

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
  // Use Zustand store instead of Redux
  const cartCount = useCartStore((state) => state.cartCount);
  const items = useCartStore((state) => state.items);

  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);
  const [prevItemsLength, setPrevItemsLength] = useState(items.length);

  useEffect(() => {
    // Trigger animation when item is added (items length increases)
    if (items.length > prevItemsLength) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevItemsLength(items.length);
    setPrevCount(cartCount);
  }, [cartCount, items.length, prevItemsLength]);

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <FiShoppingCart
          className={`text-customBlack transition-colors duration-200 ${
            isAnimating ? "text-green" : ""
          }`}
          size={iconSizes[size]}
        />

        {cartCount > 0 && (
          <span
            className={`
              absolute -top-2 -right-2 flex items-center justify-center
              rounded-full bg-orange text-white font-bold
              border-2 border-white
              transition-all duration-300 ease-out
              ${sizeClasses[size]}
              ${isAnimating ? "scale-125 bg-green" : ""}
            `}
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </div>

      {showText && (
        <span className="text-sm font-medium text-customBlack hidden sm:inline">
          Cart ({cartCount})
        </span>
      )}
    </div>
  );
}
