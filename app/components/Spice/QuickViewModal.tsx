"use client";

import { useCallback, useEffect, useState } from "react";
import { Product } from "@/typings";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/utils/currency";
import { haptic } from "@/lib/utils/hapticFeedback";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import {
  FiX,
  FiShoppingCart,
  FiCheck,
  FiHeart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRotateCw,
} from "react-icons/fi";

import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) => {
  // ---------- Zustand Selectors (minimal subscriptions) ----------
  const addToCart = useCartStore((state) => state.addToCart);

  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  // ---------- Local UI State ----------
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ---------- Derived ----------
  const isWishlisted = product?._id ? isInWishlist(product._id) : false;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      haptic.lightTap();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    haptic.lightTap();

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setQuantity(1);
      setSelectedImageIndex(0);
      setIsAddingToCart(false);
      setShowSuccess(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, handleClose]);

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (!product) return;

      if (newQuantity >= 1 && newQuantity <= product.stock) {
        setQuantity(newQuantity);
        haptic.selection();
      }
    },
    [product]
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    setIsAddingToCart(true);
    haptic.lightTap();

    addToCart(product, quantity);

    setTimeout(() => {
      setShowSuccess(true);
      haptic.success();
    }, 100);

    setTimeout(() => {
      setShowSuccess(false);
      setIsAddingToCart(false);
    }, 1500);
  }, [product, quantity, addToCart]);

  const handleWishlistToggle = useCallback(() => {
    if (!product?._id) return;

    haptic.selection();

    if (isWishlisted) {
      removeFromWishlist(product._id);
      Notify.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      Notify.success("Added to wishlist");
    }
  }, [product, isWishlisted, addToWishlist, removeFromWishlist]);

  const handleShare = useCallback(() => {
    if (!product) return;

    const url = `${window.location.origin}/shop-spices/${product.slug}`;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      Notify.success("Link copied to clipboard!");
    }

    haptic.success();
  }, [product]);

  if (!product) return null;

  const imagesRaw =
    typeof product.images === "string"
      ? [product.images]
      : product.images || [];
  const images = imagesRaw.filter(
    (image): image is string =>
      typeof image === "string" &&
      image.trim() !== "" &&
      image !== "null" &&
      image !== "undefined"
  );
  const primaryImage = images[selectedImageIndex] ?? "/placeholder.svg";

  const isOutOfStock = product.stock === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? isClosing
              ? "opacity-0"
              : "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-6 transform transition-transform duration-300 ${
          isOpen
            ? isClosing
              ? "translate-y-full md:translate-y-2 md:opacity-0"
              : "translate-y-0 md:opacity-100"
            : "translate-y-full md:opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] md:max-h-[85vh] w-full md:max-w-5xl overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-primaryGrey">
            <div>
              <h2 className="text-lg font-semibold text-customBlack">Quick View</h2>
              <p className="text-xs text-tertiaryGrey">Preview product details instantly</p>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full hover:bg-lighterGreen transition-colors flex items-center justify-center"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 grid md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Image and gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square bg-lighterGreen rounded-xl overflow-hidden">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-orange"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-customBlack">{product.name}</h1>
                <p className="text-3xl font-bold text-customBlack mt-1">
                  {formatNaira(product.price)}
                </p>
                <p className={`text-sm mt-2 font-medium ${isOutOfStock ? "text-red" : "text-green"}`}>
                  {isOutOfStock ? "Out of stock" : `In stock (${product.stock} available)`}
                </p>
                {product.description && (
                  <p className="text-sm text-tertiaryGrey mt-3 leading-6 line-clamp-4">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Quantity */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-primaryGrey">
                  <span className="text-sm font-medium text-customBlack">Quantity</span>
                  <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full border border-primaryGrey flex items-center justify-center disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>

                  <span className="w-8 text-center font-semibold">{quantity}</span>

                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-full border border-primaryGrey flex items-center justify-center disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 items-center">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className={`btn flex-1 border-none text-white transition-colors duration-200 ${
                    showSuccess ? "bg-green" : "bg-orange hover:bg-green"
                  }`}
                >
                  {showSuccess ? (
                    <span className="flex items-center gap-2">
                      <FiCheck />
                      Added!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiShoppingCart />
                      Add to Cart
                    </span>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="w-11 h-11 rounded-full border border-primaryGrey flex items-center justify-center hover:bg-lighterGreen transition-colors"
                >
                  <FiHeart
                    className={`w-5 h-5 ${isWishlisted ? "text-red fill-current" : "text-customBlack"}`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full border border-primaryGrey flex items-center justify-center hover:bg-lighterGreen transition-colors"
                >
                  <FiShare2 className="w-5 h-5 text-customBlack" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-tertiaryGrey">
                  <FiTruck className="w-4 h-4 text-green" />
                  Fast delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-tertiaryGrey">
                  <FiShield className="w-4 h-4 text-green" />
                  Quality assured
                </div>
                <div className="flex items-center gap-2 text-sm text-tertiaryGrey">
                  <FiRotateCw className="w-4 h-4 text-green" />
                  Easy returns
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-primaryGrey bg-white">
            <Link
              href={`/shop-spices/${product.slug}`}
              onClick={handleClose}
              className="btn btn-outline w-full border-primaryGrey hover:bg-lighterGreen"
            >
              View Full Product Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;
