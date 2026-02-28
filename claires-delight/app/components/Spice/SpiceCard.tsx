"use client";

import Loading from "@/app/loading";
import { Product } from "@/typings";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { formatNaira } from "@/lib/utils/currency";
import { useCartStore } from "@/app/store/cartStore";

interface SpiceCardProps {
  product: Product;
  className?: string;
}

function SpiceCard({ product, className = "" }: SpiceCardProps) {
  const imageSrc =
    typeof product.images === "string" &&
    product.images.trim() !== "" &&
    product.images !== "null" &&
    product.images !== "undefined"
      ? product.images
      : "/placeholder.svg";
  const addToCart = useCartStore((state) => state.addToCart);
  const loading = useCartStore((state) => state.isLoading);

  const handleClick = (item: Product) => {
    addToCart(item);
    Notify.success(`${item.name} has been added to cart`, {
      ID: "MKA",
      timeout: 1923,
      showOnlyTheLastOne: true,
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className="group bg-white rounded-xl shadow-sm border border-primaryGrey hover:shadow-xl transition-all duration-300 hover:border-green/30 overflow-hidden h-full flex flex-col"
        key={product._id}
        role="article"
        aria-label={`Product: ${product.name}`}
      >
        <figure className="bg-lighterGreen p-4 flex-1 flex flex-col">
          <Suspense fallback={<Loading />}>
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={imageSrc}
                alt={`${product.name} - Claire's Delight Spice`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
            </div>
          </Suspense>
        </figure>

        <div className="p-4 flex flex-col flex-1">
          <Link href={`/shop-spices/${product.slug}`} className="flex-1">
            <h2 className="text-customBlack font-semibold text-base sm:text-lg md:text-base lg:text-lg hover:text-orange transition-colors duration-200 line-clamp-2 mb-2">
              {product.name}
            </h2>
          </Link>
          <div className="flex justify-between items-center mt-auto pt-3">
            <p className="text-customBlack font-bold text-lg sm:text-xl md:text-lg lg:text-xl">
              {formatNaira(product?.price)}
            </p>
            <button
              className="btn font-medium text-white bg-orange hover:bg-green border-none transition-all duration-200 min-h-9 sm:min-h-10 px-3 sm:px-4 text-sm sm:text-base hover:scale-105 active:scale-95"
              onClick={() => handleClick(product)}
              disabled={loading}
              aria-label={`Add ${product.name} to cart`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs sm:loading-sm" />
              ) : (
                <span className="flex items-center">
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpiceCard;
