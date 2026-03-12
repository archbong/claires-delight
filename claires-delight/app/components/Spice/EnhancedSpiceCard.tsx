"use client";

import { useState, useCallback } from "react";
import { useCartStore } from "@/app/store";
import { useWishlistStore } from "@/app/store";
import { Product } from "@/typings";
import Image from "next/image";
import Link from "next/link";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { formatNaira } from "@/lib/utils/currency";
import { FiHeart, FiShoppingCart, FiEye, FiCheck } from "react-icons/fi";
import { useQuickViewAction } from "@/app/context/QuickViewContext";
import { haptic } from "@/lib/utils/hapticFeedback";

interface EnhancedSpiceCardProps {
  product: Product;
  className?: string;
  variant?: "grid" | "list";
  showQuickView?: boolean;
  showWishlist?: boolean;
}

function EnhancedSpiceCard({
  product,
  className = "",
  variant = "grid",
  showQuickView = true,
  showWishlist = true,
}: EnhancedSpiceCardProps) {
  const imageSrc =
    typeof product.images === "string" &&
    product.images.trim() !== "" &&
    product.images !== "null" &&
    product.images !== "undefined"
      ? product.images
      : "/placeholder.svg";
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [buttonScale, setButtonScale] = useState(1);

 const addToCart = useCartStore((s) => s.addToCart);
const cartLoading = useCartStore((s) => s.isLoading);
const cartError = useCartStore((s) => s.error);
const setCartLoading = useCartStore((s) => s.setLoading);
const setCartError = useCartStore((s) => s.setError);
  const { addToWishlist, removeFromWishlist, isLoading: wishlistLoading, setLoading: setWishlistLoading, isInWishlist, } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product._id!);
  const handleAddToCart = useCallback(async (product: Product) => {
    setIsAddingToCart(true);
    setButtonScale(0.95); // Pressed effect
    haptic.lightTap();

    try {
      setCartLoading(true);

      addToCart(product);

      useCartStore.getState().setNotification({
            type: "success",
            message: `${product.name} added to cart from wishlist`,
            product,
          });

      setTimeout(() => {
        setShowSuccess(true);
        setButtonScale(1.1);
      }, 100);

      setTimeout(() => {
        setShowSuccess(false);
        setButtonScale(1);
        setIsAddingToCart(false)
      }, 1500);
    } catch (error) {
      setCartError("Failed to add to cart");
      useCartStore.getState().setNotification({
      type: "error",
      message: `${product.name} failed to add to cart`,
      product,
    });
      setIsAddingToCart(false);
    } finally {
      setCartLoading(false);
    }
  }, [addToCart, setCartLoading, setCartError]);

  const openQuickView = useQuickViewAction();

  const handleQuickView = useCallback(() => {
    haptic.lightTap();
    openQuickView(product);
  }, [openQuickView, product]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleButtonHover = useCallback((hovering: boolean) => {
    setButtonScale(hovering ? 1.05 : 1);
  }, []);

  const handleWishlistToggle = useCallback(async () => {
  try {
    setWishlistLoading(true);
    haptic.selection();

    if (isWishlisted) {
      removeFromWishlist(product._id!);
    } else {
      addToWishlist(product);
    }

    // Optional backend sync:
    // await fetch("/api/wishlist/toggle", {...});

  } catch (error) {
    useCartStore.getState().setNotification({
      type: "error",
      message: `${product.name} failed to add to wishlist`,
      product,
    });
  } finally {
    setWishlistLoading(false);
  }
}, [
  isWishlisted,
  product,
  addToWishlist,
  removeFromWishlist,
  setWishlistLoading,
]);

  // Grid variant layout
  if (variant === "grid") {
    return (
      <div className={`group ${className}`}>
        <div
          className="relative bg-[#FFF8F6] rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-dashed border-primaryGrey/40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="article"
          aria-label={`Product: ${product.name}`}
        >
          {/* Action Buttons Overlay */}
          <div
            className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
          >
            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isWishlisted
                    ? "bg-red text-white shadow-lg"
                    : "bg-white text-customBlack hover:bg-red hover:text-white shadow-md"
                  } hover:scale-110 active:scale-95 disabled:opacity-50`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <FiHeart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                )}
              </button>
            )}
          </div>

          {/* Product Image — full bleed, no inner box */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-blue-100 animate-pulse" />
            )}
            <Image
              src={imageSrc}
              alt={`${product.name} - Claire's Delight Spice`}
              fill
              className={`object-contain transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              onLoad={handleImageLoad}
            />
          </div>

          {/* Content */}
          <div className="px-5 pt-4 pb-5 flex flex-col gap-4 bg-white">
            <Link href={`/shop-spices/${product.slug}`}>
              <h2 className="text-customBlack font-bold text-xl hover:text-orange transition-colors duration-200 line-clamp-2">
                {product.name}
              </h2>
            </Link>

            <div className="flex justify-between items-center">
              <p className="text-customBlack font-extrabold text-2xl">
                {formatNaira(product?.price)}
              </p>
              <button
                className={`
            rounded-xl font-medium text-white border-none px-6 py-3 text-sm
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            ${showSuccess ? "bg-green" : "bg-orange hover:bg-green"}
            ${cartLoading ? "animate-pulse" : ""}
          `}
                onClick={() => handleAddToCart(product)}
                disabled={cartLoading || isAddingToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                {cartLoading || isAddingToCart ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : showSuccess ? (
                  <span className="flex items-center gap-1">
                    <FiCheck className="w-4 h-4" /> Added!
                  </span>
                ) : (
                  "Add To Cart"
                )}
              </button>
            </div>

            {cartError && (
              <p className="text-red-600 text-xs text-center bg-red-50 rounded-lg p-2">
                {cartError}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List variant layout
  return (
    <div className={`group ${className}`}>
      <div
        className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-primaryGrey hover:shadow-lg transition-all duration-300"
        role="article"
        aria-label={`Product: ${product.name}`}
      >
        {/* Image */}
        <div className="w-full sm:w-32 h-32 bg-lighterGreen rounded-lg overflow-hidden flex-shrink-0 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
          )}
          <Image
            src={imageSrc}
            alt={`${product.name} - Claire's Delight Spice`}
            fill
            className={`object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 640px) 100vw, 128px"
            loading="lazy"
            onLoad={handleImageLoad}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/shop-spices/${product.slug}`} className="group/link">
              <h3 className="text-lg font-semibold text-customBlack mb-2 line-clamp-2 group-hover/link:underline">
                {product.name}
              </h3>
            </Link>
            {product.description && (
              <p className="text-tertiaryGrey text-sm line-clamp-3 mb-3">
                {product.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-customBlack">
              {formatNaira(product?.price)}
            </span>

            <div className="flex items-center gap-2">
              {showWishlist && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isWishlisted
                      ? "text-red hover:bg-red/10"
                      : "text-tertiaryGrey hover:bg-gray-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {wishlistLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <FiHeart
                      className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  )}
                </button>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                disabled={cartLoading || isAddingToCart}
                className={`
                  btn bg-orange hover:bg-green text-white border-none
                  min-h-10 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  ${showSuccess ? "bg-green scale-105" : ""}
                `}
                style={{ transform: `scale(${buttonScale})` }}
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
                aria-label={`Add ${product.name} to cart`}
              >
                {cartLoading || isAddingToCart ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : showSuccess ? (
                  <span className="flex items-center gap-1 animate-bounce">
                    <FiCheck className="w-4 h-4" />
                    Added!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    Add to Cart
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {cartError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-xs text-center">{cartError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedSpiceCard;
