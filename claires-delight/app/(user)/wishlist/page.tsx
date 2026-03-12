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
import { useCartStore, useWishlistStore } from "@/app/store";
import Footer from "@/app/components/footer/Footer";
import Navbar from "@/app/components/header/navbar/Navbar";

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

      useCartStore.getState().setNotification({
        type: "success",
        message: `${product.name} added to cart from wishlist`,
        product,
      });

    } catch {
      haptic.error();
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Glassmorphism Effect */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link
              href="/shop-spices"
              className="group flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-gray-100"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Shop
            </Link>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                {wishlistItems.length} saved item
                {wishlistItems.length !== 1 && "s"}
              </p>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              disabled={isLoading}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <FiTrash2 className="w-4 h-4 group-hover:scale-95 transition-transform" />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty State - Enhanced */}
        {wishlistItems.length === 0 && (
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-16 text-center overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-green-50/50"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative">
              <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center animate-pulse-soft">
                <FiHeart className="w-14 h-14 text-orange-500" />
              </div>

              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Your wishlist is empty
              </h2>

              <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                Save your favorite spices and they'll appear here. Start exploring our collection!
              </p>

              <Link
                href="/shop-spices"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Browse Spices
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Grid - Modern Card Design */}
        {wishlistItems.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product, index) => {
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
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative bg-gradient-to-br from-orange-50 to-green-50 p-6">
                    <Link
                      href={`/shop-spices/${product.slug}`}
                      className="block relative aspect-square overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </Link>

                    {/* Remove Button - Modern Floating Action */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id!)}
                      disabled={isLoading}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-300 group/remove"
                    >
                      <FiX className="w-5 h-5 group-hover/remove:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Stock Badge */}
                    <div className="absolute bottom-3 left-3">
                      {product.stock === 0 ? (
                        <span className="px-3 py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow p-6">
                    <Link href={`/shop-spices/${product.slug}`}>
                      <h3 className="font-bold text-xl leading-tight mb-2 text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price with Modern Design */}
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        {formatNaira(product.price)}
                      </span>
                      {product.stock > 0 && (
                        <span className="text-xs text-gray-400">
                          • {product.stock} available
                        </span>
                      )}
                    </div>

                    {/* Actions - Modern Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() => handleAddToCartFromWishlist(product)}
                        disabled={product.stock === 0 || isLoading}
                        className="group/btn w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl py-3.5 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                      >
                        <FiShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
     <Footer />
    </div>
  );
}
