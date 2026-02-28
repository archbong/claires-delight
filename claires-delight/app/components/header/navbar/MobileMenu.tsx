// MobileMenu.tsx - Enhanced mobile hamburger menu with smooth animations
"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { IoClose } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { title: "Home", path: "/", icon: "🏠" },
    { title: "Shop Spices", path: "/shop-spices", icon: "🌶️" },
    { title: "Recipes", path: "/recipes", icon: "📖" },
    { title: "About Us", path: "/about", icon: "👥" },
    { title: "Blog", path: "/blog", icon: "📝" },
    { title: "Wishlist", path: "/wishlist", icon: "❤️" },
  ];

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        ref={backdropRef}
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Mobile menu with slide-in animation */}
      <div
        ref={menuRef}
        className={cn(
          "fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-customBlack">Menu</h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-full hover:bg-gray-100 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2",
              "touch-device:touch-optimized",
            )}
            aria-label="Close menu"
          >
            <IoClose className="w-6 h-6 text-customBlack" />
          </button>
        </div>

        {/* Navigation links */}
        <nav
          className="flex-1 overflow-y-auto p-6"
          aria-label="Mobile navigation"
        >
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2",
                  pathname === link.path
                    ? "bg-red/10 text-red font-semibold"
                    : "text-customBlack hover:text-orange",
                )}
                onClick={handleLinkClick}
                aria-current={pathname === link.path ? "page" : undefined}
              >
                <span className="mr-3 text-lg" aria-hidden="true">
                  {link.icon}
                </span>
                {link.title}
                {link.path === "/wishlist" && wishlistItems.length > 0 && (
                  <span className="ml-auto bg-red text-white text-xs px-2 py-1 rounded-full">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer with contact button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Link href="/contact" onClick={handleLinkClick}>
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              aria-label="Contact us"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
