"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiCheckCircle, FiInfo, FiShoppingCart, FiXCircle } from "react-icons/fi";
import { Product } from "@/typings";
import { formatNaira } from "@/lib/utils/currency";
import { useCartStore } from "@/app/store/cartStore";

interface NotificationItem {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  product: Product | null;
}

export default function CartNotification() {
  const notification = useCartStore((state) => state.notification);
  const clearNotification = useCartStore((state) => state.clearNotification);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!notification.type || !notification.message) {
      return;
    }

    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: notification.type,
      message: notification.message,
      product: notification.product,
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
    setIsVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      clearNotification();
      setIsVisible(false);
    }, 4000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [notification, clearNotification]);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <FiInfo className="w-5 h-5 text-blue-500" />;
      default:
        return <FiShoppingCart className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          className={`
            transform transition-all duration-500 ease-in-out
            ${getBackgroundColor(notif.type)}
            border rounded-xl shadow-lg p-4
            ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
            hover:shadow-xl transition-shadow duration-200
          `}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">{notif.message}</p>

              {notif.product && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-lg border">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={notif.product.images || "/placeholder.svg"}
                      alt={notif.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{notif.product.name}</p>
                    <p className="text-xs text-green-600 font-semibold">{formatNaira(notif.product.price)}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleClose(notif.id)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close notification"
            >
              <FiXCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
