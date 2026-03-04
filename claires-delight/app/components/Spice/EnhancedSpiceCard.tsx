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
      Notify.failure("Failed to add to cart");
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
    Notify.failure("Wishlist action failed");
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
          className="relative bg-white rounded-xl border border-primaryGrey hover:shadow-xl transition-all duration-300 hover:border-green/30 overflow-hidden h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="article"
          aria-label={`Product: ${product.name}`}
        >
          {/* Image Container */}
          <figure className="p-4 flex-1 flex flex-col relative">
            {/* Action Buttons Overlay */}
            <div
              className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              {showWishlist && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isWishlisted
                      ? "bg-red text-white shadow-lg"
                      : "bg-white text-customBlack hover:bg-red hover:text-white shadow-md"
                  } hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
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

              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="w-10 h-10 rounded-full bg-white text-customBlack flex items-center justify-center hover:bg-green hover:text-white transition-all duration-200 shadow-md hover:scale-110 active:scale-95"
                  aria-label="Quick view"
                >
                  <FiEye className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Product Image */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse " />
              )}
              <Image
                src={imageSrc}
                alt={`${product.name} - Claire's Delight Spice`}
                fill
                className={`object-cover transition-transform duration-500 ${
                  isHovered ? "scale-105" : "scale-100"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                onLoad={handleImageLoad}
              />
            </div>
          </figure>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <Link
              href={`/shop-spices/${product.slug}`}
              className="flex-1 group/link"
            >
              <h2 className="text-customBlack font-semibold text-base sm:text-lg md:text-base lg:text-lg hover:text-orange transition-colors duration-200 line-clamp-2 mb-2">
                {product.name}
              </h2>
            </Link>

            {/* Price and Add to Cart */}
            <div className="flex justify-between items-center mt-auto pt-3">
              <p className="text-customBlack font-bold text-lg sm:text-xl md:text-lg lg:text-xl">
                {formatNaira(product?.price)}
              </p>
              <button
                className={`
                  btn font-medium text-white border-none transition-all duration-200
                  min-h-9 sm:min-h-10 px-3 sm:px-4 text-sm sm:text-base
                  disabled:opacity-50 disabled:cursor-not-allowed
                  relative overflow-hidden
                  ${showSuccess ? "bg-green scale-105" : "bg-orange hover:bg-green"}
                  ${cartLoading ? "animate-pulse" : ""}
                `}
                style={{ transform: `scale(${buttonScale})` }}
                onClick={() => handleAddToCart(product)}
                disabled={cartLoading || isAddingToCart}
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
                aria-label={`Add ${product.name} to cart`}
              >
                {cartLoading || isAddingToCart ? (
                  <span className="loading loading-spinner loading-xs sm:loading-sm" />
                ) : showSuccess ? (
                  <span className="flex items-center gap-1 animate-bounce">
                    <FiCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Added!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    {/* <FiShoppingCart className="w-4 h-4" /> */}
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </span>
                )}

                {/* Ripple effect */}
                {showSuccess && (
                  <span className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full" />
                )}
              </button>
            </div>

            {/* Error message */}
            {cartError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs text-center">
                  {cartError}
                </p>
              </div>
            )}
          </div>

          {/* Hover effect overlay */}
          <div
            className={`absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl`}
          />
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
