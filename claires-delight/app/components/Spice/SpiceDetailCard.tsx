"use client";

import Image from "next/image";
import { Suspense, useMemo, useState, useCallback } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { IoIosStar } from "react-icons/io";
import { MdOutlineAdd } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import Subtitle from "../typography/Subtitle";
import BodyWrapper from "../layout/BodyWrapper";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { haptic } from "@/lib/utils/hapticFeedback";
import { Notify } from "notiflix/build/notiflix-notify-aio";

export default function SpiceDetailCard({ item }: any) {
  const imageSrc =
    typeof item?.images === "string" &&
    item.images.trim() !== "" &&
    item.images !== "null" &&
    item.images !== "undefined"
      ? item.images
      : "/placeholder.svg";
  const addToCart = useCartStore((state) => state.addToCart);
  const cartLoading = useCartStore((state) => state.isLoading);

  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const wishlistLoading = useWishlistStore((state) => state.isLoading);

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const isWishlisted = useMemo(() => {
    if (!item?._id) return false;
    return isInWishlist(item._id);
  }, [item?._id, isInWishlist]);

  const handleQuantityChange = (qty: number) => {
    if (qty >= 1 && qty <= item.stock) {
      setQuantity(qty);
    }
  };

  const handleWishlistToggle = useCallback(async () => {
    if (!item?._id) return;

    haptic.selection();

    if (isWishlisted) {
      removeFromWishlist(item._id);
      Notify.info(`${item.name} removed from wishlist`);
    } else {
      addToWishlist(item);
      Notify.success(`${item.name} added to wishlist`);
    }
  }, [item, isWishlisted, addToWishlist, removeFromWishlist]);

  const handleAddToCart = useCallback(async () => {
    if (!item) return;

    setIsAddingToCart(true);
    haptic.lightTap();

    try {
      addToCart(item, quantity);
      setTimeout(() => {
        setShowCartSuccess(true);
      }, 100);

      setTimeout(() => {
        setShowCartSuccess(false);
        setIsAddingToCart(false);
      }, 1500);
    } catch {
      setIsAddingToCart(false);
      setShowCartSuccess(false);
      haptic.error();
      Notify.failure("Failed to add product to cart");
    }
  }, [item, quantity, addToCart]);

  const isOutOfStock = item?.stock === 0;
  const culinaryUses = Array.isArray(item?.culinaryUses) ? item.culinaryUses : [];
  const healthBenefits = Array.isArray(item?.healthBenefit) ? item.healthBenefit : [];
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(item?.price ?? 0);

  return (
    <BodyWrapper>
      <section className="rounded-3xl border border-primaryGrey/60 bg-white/90 p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Suspense>
            <div
              className="rounded-3xl bg-[#FFF8F6] relative border border-primaryGrey/40 p-4 sm:p-6"
              style={{ width: "100%", overflow: "hidden" }}
            >
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isWishlisted
                    ? "bg-red text-white shadow-lg"
                    : "bg-white text-customBlack hover:bg-red hover:text-white shadow-md"
                } hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <FiHeart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                )}
              </button>

              <Image
                src={imageSrc}
                alt={item.name}
                width={900}
                height={900}
                className="rounded-2xl"
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
          </Suspense>

          <div className="flex flex-col">
            <Subtitle title={item.name} />

            <div className="mt-3 inline-flex items-center gap-3 rounded-full bg-[#FFF8F6] px-4 py-2 w-fit">
              <span className="flex justify-between text-orange text-lg">
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
              </span>
              <p className="text-sm text-tertiaryGrey">{item?.reviewCount ?? 0} Reviews</p>
            </div>

            <p className="mt-4 text-tertiaryGrey leading-7">{item.description}</p>

            <div className="mt-8 rounded-2xl border border-primaryGrey/50 bg-[#fcfcfc] p-5 sm:p-6">
              <small className="text-teritaryGrey uppercase tracking-wide">Price</small>
              <p className="font-bold text-3xl mt-1 text-customBlack">₦{formattedPrice}</p>

              <div className="mt-4">
                {isOutOfStock ? (
                  <span className="inline-flex rounded-full bg-red/10 px-3 py-1 text-sm text-red font-medium">
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-green/10 px-3 py-1 text-sm text-green font-medium">
                    In Stock ({item.stock} available)
                  </span>
                )}
              </div>

              <div className="mt-6">
                <small className="text-teritaryGrey uppercase tracking-wide">Quantity</small>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="border border-primaryGrey/70 flex flex-row justify-around items-center w-[10rem] h-[3rem] rounded-xl bg-white">
                  <button
                    className="bg-white hover:bg-gray-100 border-r px-3 h-full"
                    aria-label="decrease"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <AiOutlineMinus />
                  </button>
                  <p className="bg-white border-r border-l px-4">{quantity}</p>
                  <button
                    className="bg-white hover:bg-gray-100 border-l px-3 h-full"
                    aria-label="increase"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <MdOutlineAdd />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button className="bg-orange btn text-white min-w-[8rem]" disabled={isOutOfStock}>
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart || cartLoading}
                    className={`btn text-orange min-w-[8rem] transition-all duration-200 ${
                      showCartSuccess ? "bg-green text-white" : ""
                    } ${isAddingToCart ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isAddingToCart || cartLoading ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : showCartSuccess ? (
                      "Added!"
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-primaryGrey/60 bg-[#FFF8F6] p-6">
          <h3 className="text-xl font-semibold text-customBlack">Recipe Suggestion</h3>
          <p className="mt-2 text-tertiaryGrey">Origin: {item.origin}</p>
          <ul className="mt-4 space-y-2">
            {culinaryUses.map((use: any, index: any) => (
              <li key={index} className="rounded-lg bg-white px-3 py-2 border border-primaryGrey/40">
                {use}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-primaryGrey/60 bg-[#FFF8F6] p-6">
          <h3 className="text-xl font-semibold text-customBlack">Health Benefit</h3>
          <ul className="mt-4 space-y-2">
            {healthBenefits.map((benefit: any, index: number) => (
              <li key={index} className="rounded-lg bg-white px-3 py-2 border border-primaryGrey/40">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </BodyWrapper>
  );
}
