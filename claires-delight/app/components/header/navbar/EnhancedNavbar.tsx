// EnhancedNavbar.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FiHeart } from "react-icons/fi";
import CartCounter from "@/app/components/notification/CartCounter";
import { IoSearch, IoMenu, IoClose } from "react-icons/io5";
import { Button } from "@/app/components/ui/Button";
import Logo from "../logo/Logo";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchSuggestions from "@/app/components/search/SearchSuggestions";
import MobileSearchOverlay from "@/app/components/search/MobileSearchOverlay";
import { Product } from "@/typings";
import { searchProducts } from "@/lib/searchUtils";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useProductsStore } from "@/app/store/productsStore";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";

interface NavLink {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

const navLinks: NavLink[] = [
  { title: "Home", path: "/" },
  { title: "Shop Spices", path: "/shop-spices" },
  { title: "Recipes", path: "/recipes" },
  { title: "About Us", path: "/about" },
  { title: "Blog", path: "/blog" },
];

export interface EnhancedNavbarProps {
  onSearch?: (query: string) => void;
}

const EnhancedNavbar: React.FC<EnhancedNavbarProps> = ({ onSearch }) => {
  const pathname = usePathname();

  // Zustand stores
  const { products, searchTerm, updateSearchTerm, setSearchTerm } =
    useProductsStore();

  const { cartCount } = useCartStore();
  const { wishlistItems, getWishlistCount } = useWishlistStore();

  const wishlistCount = getWishlistCount();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search term for suggestions
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  // Enhanced scroll detection with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };

    // Use requestAnimationFrame for smoother scroll handling
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sync input value with store search term
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Generate search suggestions
  useEffect(() => {
    const generateSuggestions = async () => {
      if (debouncedSearchTerm.length >= 2 && products.length > 0) {
        setIsSearchLoading(true);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Add small delay to show loading state
        searchTimeoutRef.current = setTimeout(() => {
          const results = searchProducts(products, debouncedSearchTerm, 5);
          setSearchSuggestions(results);
          setIsSearchLoading(false);
        }, 100);
      } else {
        setSearchSuggestions([]);
        setIsSearchLoading(false);
      }
    };

    generateSuggestions();

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [debouncedSearchTerm, products]);

  const debouncedHandleSearchChange = useDebouncedCallback((value: string) => {
    updateSearchTerm(value);
    localStorage.setItem("searchTerm", value);
    if (onSearch) {
      onSearch(value);
    }
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedHandleSearchChange(value);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSuggestionSelect = useCallback(
    (suggestion: Product) => {
      setInputValue(suggestion.name);
      updateSearchTerm(suggestion.name);
      localStorage.setItem("searchTerm", suggestion.name);
      setIsSearchOpen(false);

      if (onSearch) {
        onSearch(suggestion.name);
      }

      // Navigate to product page
      window.location.href = `/product/${suggestion.slug}`;
    },
    [updateSearchTerm, onSearch],
  );

  const handleMobileSuggestionSelect = useCallback(
    (suggestion: Product) => {
      setInputValue(suggestion.name);
      updateSearchTerm(suggestion.name);
      localStorage.setItem("searchTerm", suggestion.name);
      setIsMobileSearchOpen(false);

      if (onSearch) {
        onSearch(suggestion.name);
      }

      // Navigate to product page
      window.location.href = `/product/${suggestion.slug}`;
    },
    [updateSearchTerm, onSearch],
  );

  const handleClearSearch = () => {
    setInputValue("");
    updateSearchTerm("");
    localStorage.removeItem("searchTerm");

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <>
      {/* Enhanced Navbar with smooth transitions */}
      <header
        className={cn(
  "fixed top-0 w-full z-50 transition-all duration-500 ease-out",
  "backdrop-blur-md supports-backdrop-blur:bg-white/90",
  isScrolled
    ? "shadow-lg border-b border-gray-100"
    : "border-b border-transparent",
    "bg-white/95 hover:bg-green/65",
)}  role="banner"
        aria-label="Main navigation"
      >
        <div className="responsive-container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-8"
              aria-label="Desktop navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "relative font-medium text-sm transition-colors duration-300",
                    "hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 rounded-md px-2 py-1",
                    pathname === link.path
                      ? "text-red font-semibold after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-red after:rounded-full"
                      : "text-customBlack hover:text-orange",
                  )}
                  aria-current={pathname === link.path ? "page" : undefined}
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                {isSearchOpen ? (
                  <div className="flex items-center bg-white rounded-full shadow-md border border-gray-200 pl-4 pr-2 py-1 relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleSearchChange}
                      placeholder="Search spices..."
                      className="w-32 lg:w-48 border-none bg-transparent text-sm focus:outline-none focus:ring-0"
                      aria-label="Search products"
                    />
                    {inputValue && (
                      <button
                        onClick={handleClearSearch}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Clear search"
                      >
                        <IoClose className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={handleSearchToggle}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Close search"
                    >
                      <IoClose className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Search Suggestions */}
                    <SearchSuggestions
                      suggestions={searchSuggestions}
                      searchTerm={inputValue}
                      isLoading={isSearchLoading}
                      isVisible={isSearchOpen && inputValue.length >= 2}
                      onSelectSuggestion={handleSuggestionSelect}
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-device:touch-optimized"
                    aria-label="Open search"
                  >
                    <IoSearch className="w-5 h-5 text-customBlack" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-device:touch-optimized"
                aria-label="Shopping cart"
              >
                <CartCounter size="md" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-device:touch-optimized relative"
                aria-label="Wishlist"
              >
                <FiHeart className="w-5 h-5 text-customBlack" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Contact Button */}
              <div className="hidden md:block">
                <Link href="/contact">
                  {/* <Button
                  
                    size="sm"
                    className="whitespace-nowrap bg-orange"
                    aria-label="Contact us"
                  >
                    Contact Us
                  </Button> */}
                  <button
                    type="submit"
                    className="btn w-[150px] h-[50px] bg-orange text-white"
                    // disabled={loading}
                  >
                    Contact Us 
                  </button>
                </Link>
              </div>

              {/* Mobile Search Toggle */}
              <button
                onClick={handleMobileSearchToggle}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors touch-device:touch-optimized"
                aria-label="Open mobile search"
              >
                <IoSearch className="w-5 h-5 text-customBlack" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors touch-device:touch-optimized"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <IoClose className="w-6 h-6 text-customBlack" />
                ) : (
                  <IoMenu className="w-6 h-6 text-customBlack" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {/* {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 mt-2 pt-4 pb-4 bg-white rounded-lg shadow-lg">
              <nav
                className="flex flex-col space-y-3"
                aria-label="Mobile navigation"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2",
                      pathname === link.path
                        ? "text-red bg-red/10 font-semibold"
                        : "text-customBlack",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={pathname === link.path ? "page" : undefined}
                  >
                    {link.title}
                  </Link>
                ))}
                <div className="px-4 pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )} */}
        </div>
      </header>

      {/* Enhanced Mobile Menu with smooth animations */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        searchTerm={inputValue}
        onSearchChange={setInputValue}
        suggestions={searchSuggestions}
        isLoading={isSearchLoading}
        onSelectSuggestion={handleMobileSuggestionSelect}
      />

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default EnhancedNavbar;
