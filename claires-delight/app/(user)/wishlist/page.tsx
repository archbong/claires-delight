"use client";

import { Product } from "@/typings";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/utils/currency";
import { haptic } from "@/lib/utils/hapticFeedback";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiX,
  FiArrowLeft,
  FiPlus,
} from "react-icons/fi";
import { useWishlistStore } from "@/app/store";

export default function WishlistPage() {
 const isLoading = useWishlistStore((state) => state.isLoading)
 const error = useWishlistStore((state) => state.error);
 const addToCart = useWishlistStore((state) => state.addToWishlist);
 const wishlistItems = useWishlistStore((state) => state.wishlistItems);
 const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
 const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const handleRemoveFromWishlist = async (productId: string) => {
    haptic.lightTap();
    try {
      removeFromWishlist(productId);
      haptic.success();
    } catch {
      haptic.error();
      Notify.failure("Failed to remove from wishlist");
    }
  };

  const handleClearWishlist = async () => {
    haptic.warning();
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      try {
        clearWishlist();
        haptic.success();
        Notify.success("Wishlist cleared successfully");
      } catch {
        haptic.error();
        Notify.failure("Failed to clear wishlist");
      }
    }
  };

  const handleAddToCartFromWishlist = async (product: Product) => {
    haptic.lightTap();
    try {
      addToCart(product);
      haptic.success();
      Notify.success(`${product.name} added to cart from wishlist`);
    } catch {
      haptic.error();
      Notify.failure("Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/shop-spices"
                className="btn btn-ghost btn-sm text-tertiaryGrey hover:text-customBlack transition-colors duration-200"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-customBlack">
                  My Wishlist
                </h1>
                <p className="text-tertiaryGrey mt-1">
                  {wishlistItems.length} item{wishlistItems.length !== 1 && "s"}{" "}
                  saved
                </p>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="btn btn-outline btn-error btn-sm text-red hover:bg-red hover:text-white transition-colors duration-200"
                disabled={isLoading}
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-primaryGrey">
              <div className="w-24 h-24 mx-auto mb-6 bg-lighterGreen rounded-full flex items-center justify-center">
                <FiHeart className="w-12 h-12 text-green" />
              </div>
              <h2 className="text-2xl font-semibold text-customBlack mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-tertiaryGrey mb-8 max-w-md mx-auto">
                Start exploring our collection of premium spices and add your
                favorites to your wishlist.
              </p>
              <Link
                href="/shop-spices"
                className="btn bg-orange hover:bg-green text-white border-none transition-colors duration-200"
              >
                <FiPlus className="w-5 h-5" />
                Browse Spices
              </Link>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <FiX className="w-6 h-6 text-red" />
                <h3 className="text-lg font-semibold text-red">Error</h3>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Wishlist Grid */}
          {wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => {
                const imageSrc =
                  typeof product.images === "string" &&
                  product.images.trim() !== "" &&
                  product.images !== "null" &&
                  product.images !== "undefined"
                    ? product.images
                    : "/placeholder.svg";

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm border border-primaryGrey hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                  {/* Image */}
                  <div className="relative bg-lighterGreen p-4">
                    <Link
                      href={`/shop-spices/${product.slug}`}
                      className="block relative aspect-square overflow-hidden rounded-lg"
                    >
                      <Image
                        src={imageSrc}
                        alt={`${product.name} - Claire's Delight Spice`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id!)}
                      disabled={isLoading}
                      className="absolute top-3 right-3 w-10 h-10 bg-white text-red rounded-full flex items-center justify-center shadow-md hover:bg-red hover:text-white transition-all duration-200 disabled:opacity-50"
                      aria-label="Remove from wishlist"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link
                      href={`/shop-spices/${product.slug}`}
                      className="group/link"
                    >
                      <h3 className="font-semibold text-customBlack text-base line-clamp-2 mb-2 group-hover/link:text-orange transition-colors duration-200">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-customBlack">
                        {formatNaira(product.price)}
                      </span>
                      {product.stock === 0 ? (
                        <span className="text-sm text-red font-medium">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="text-sm text-green font-medium">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCartFromWishlist(product)}
                        disabled={product.stock === 0 || isLoading}
                        className="flex-1 btn bg-orange hover:bg-green text-white border-none transition-colors duration-200 disabled:opacity-50"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Empty Space */}
          <div className="h-8 md:h-16"></div>
        </div>
      </div>
    </div>
  );
}
