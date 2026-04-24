"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiCheckCircle, FiShoppingCart, FiX } from "react-icons/fi";
import { Product } from "@/typings";
import { formatNaira } from "@/lib/utils/currency";
import { useCartStore } from "@/app/store/cartStore";

interface CartNotificationProps {
  duration?: number;
}

export default function CartNotification({ duration = 4000 }: CartNotificationProps) {
  const notification = useCartStore((state) => state.notification);
  const clearNotification = useCartStore((state) => state.clearNotification);

  const [visible, setVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only trigger for success notifications with products
    if (notification.type === "success" && notification.product) {
      setCurrentProduct(notification.product);
      setVisible(true);
      setProgress(100);

      // Clear any existing timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Progress bar animation
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(progressIntervalRef.current!);
        }
      }, 10);

      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        setVisible(false);
        clearInterval(progressIntervalRef.current!);
        setTimeout(() => {
          clearNotification();
          setCurrentProduct(null);
        }, 300);
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [notification, clearNotification, duration]);

  const handleClose = () => {
    setVisible(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setTimeout(() => {
      clearNotification();
      setCurrentProduct(null);
    }, 300);
  };

  const handleGoToCart = () => {
    handleClose();
    // Optional: Open cart sidebar if you have one
    // useCartStore.getState().openCart();
  };

  if (!currentProduct) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
  <div
    className={`
      flex items-center justify-between
      w-[360px]
      px-4 py-3
      rounded-md
      border border-green-200
      border-l-4 border-l-green-500
      bg-green-100
      shadow-md
      transition-all duration-300
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
    `}
  >
    {/* Left side */}
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
        <FiCheck className="text-white w-4 h-4" />
      </div>

      <span className="text-gray-800 text-sm font-medium">
        Successfully Added
      </span>
    </div>

    {/* Right side */}
    <div className="flex items-center gap-4">
      <Link
        href="/cart"
        className="text-orange-500 font-semibold text-sm hover:underline"
      >
        Go To Cart
      </Link>

      <button
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
  );
}