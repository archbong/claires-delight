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
    { title: "Home", path: "/" },
    { title: "Shop Spices", path: "/shop-spices" },
    { title: "Recipes", path: "/recipes" },
    { title: "About Us", path: "/about" },
    { title: "Blog", path: "/blog" },
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
          "fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-[#F6FFE9] z-50 shadow-2xl",
          "transform transition-transform duration-300 ease-in-out rounded-l-3xl",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header with close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={cn(
              "p-3 rounded-full hover:bg-gray-100 transition-colors",
              "touch-device:touch-optimized",
            )}
            aria-label="Close menu"
          >
            <IoClose className="w-6 h-6 text-customBlack" />
          </button>
        </div>

        {/* Navigation links */}
        <nav
          className="overflow-y-auto p-6"
          aria-label="Mobile navigation"
        >
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "flex items-center px-2 py-2 text-sm border-b border-gray-200 ransition-all duration-200",
                  pathname === link.path
                    ? "text-orange font-semibold"
                    : "text-customBlack hover:text-orange",
                )}
                // className="flex items-center text-sm py-2"
                onClick={handleLinkClick}
                aria-current={pathname === link.path ? "page" : undefined}
              >
                {link.title}
                {/* {link.path === "/wishlist" && wishlistItems.length > 0 && (
                  <span className="ml-auto bg-red text-white text-xs px-2 py-1 rounded-full">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )} */}
              </Link>
            ))}
          </div>

         
        </nav>
         <div className="relative top-[8%] w-full flex justify-center">
          <Link href="/contact">
            <button onClick={handleLinkClick}
             className="btn w-[150px] h-[50px] bg-orange border-none text-white font-normal text-xs hover:bg-orange ">
              Contact Us
            </button>
          </Link>
        </div>

        {/* Footer with contact button */}
        {/* <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Link href="/contact" >
            <Button
              size="sm"
              className="w-full justify-center bg-organge hover:bg-orange/90 text-white transition-colors"
              aria-label="Contact us"
            >
              Contact Us
            </Button>
          </Link>
        </div> */}
        
      </div>
    </>
  );
};

export default MobileMenu;
