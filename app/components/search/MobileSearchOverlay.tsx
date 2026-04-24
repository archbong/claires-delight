"use client";

import React, { useEffect, useRef } from "react";
import { Product } from "@/typings";
import { cn } from "@/lib/utils";
import { FiSearch, FiX, FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  suggestions: Product[];
  isLoading: boolean;
  onSelectSuggestion: (suggestion: Product) => void;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  suggestions,
  isLoading,
  onSelectSuggestion,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key to close overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClearSearch = () => {
    onSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestion: Product) => {
    onSelectSuggestion(suggestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 px-4 py-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex-1 ml-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search spices, herbs, recipes..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-0 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red focus:bg-white"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-red border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Search Results
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion._id || suggestion.slug}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {suggestion.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">
                          {suggestion.category?.[0]?.title || "Spice"}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm font-medium text-red">
                          ${suggestion.price.toFixed(2)}
                        </span>
                        {suggestion.discount && suggestion.discount > 0 && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm font-medium text-green-600">
                              {suggestion.discount}% off
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="flex flex-col items-center justify-center h-64 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 text-center">
                We couldn't find any matches for "{searchTerm}"
              </p>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Recent Searches
              </h3>
              <div className="space-y-2">
                {/* Placeholder for recent searches - can be implemented with localStorage */}
                <button
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  disabled
                >
                  <FiSearch className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">No recent searches</span>
                </button>
              </div>

              <h3 className="text-sm font-medium text-gray-500 mt-6 mb-3">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Cinnamon", "Turmeric", "Black Pepper", "Ginger", "Cardamom"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => onSearchChange(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Press Esc to close</span>
            <span>
              {searchTerm.length >= 2
                ? `${suggestions.length} result${suggestions.length !== 1 ? "s" : ""}`
                : "Start typing to search"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchOverlay;
