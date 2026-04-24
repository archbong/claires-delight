"use client";

import Loading from "@/app/loading";
import { Product } from "@/typings";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { formatNaira } from "@/lib/utils/currency";
import { useCartStore } from "@/app/store/cartStore";

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: Props) {
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
    <div className={`flex justify-center items-center ${className}`}>
      <div className="w-full max-w-sm">
        <div
          className="card card-compact w-full bg-base-100 shadow-md border border-primaryGrey hover:shadow-lg transition-shadow duration-300"
          key={product._id}
        >
          <figure className="bg-lighterGreen p-4">
            <Suspense fallback={<Loading />}>
              <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                <Image
                  src={imageSrc}
                  alt={`${product.name} - Claire's Delight Spice`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            </Suspense>
          </figure>
          <div className="card-body p-4">
            <Link href={`/shop-spices/${product.slug}`}>
              <h2 className="card-title text-customBlack font-semibold text-lg hover:text-orange transition-colors duration-200 line-clamp-2">
                {product.name}
              </h2>
            </Link>
            <div className="card-actions flex justify-between items-center mt-3">
              <p className="text-customBlack font-bold text-xl">{formatNaira(product?.price)}</p>
              <button
                className="btn font-light text-white bg-orange hover:bg-green border-none transition-colors duration-200 min-h-10 px-4"
                onClick={() => handleClick(product)}
                disabled={loading}
                aria-label={`Add ${product.name} to cart`}
              >
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
