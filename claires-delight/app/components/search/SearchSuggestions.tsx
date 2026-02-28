"use client";

import React from "react";
import { Product } from "@/typings";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";

interface SearchSuggestionsProps {
  suggestions: Product[];
  searchTerm: string;
  isLoading: boolean;
  isVisible: boolean;
  onSelectSuggestion: (suggestion: Product) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  searchTerm,
  isLoading,
  isVisible,
  onSelectSuggestion,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red"></div>
            <p className="mt-2 text-sm text-gray-600">Searching...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <>
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500">
                Search results for "{searchTerm}"
              </p>
            </div>
            <ul className="divide-y divide-gray-100">
              {suggestions.map((suggestion) => (
                <li key={suggestion._id || suggestion.slug}>
                  <button
                    type="button"
                    onClick={() => onSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <FiSearch className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {suggestion.category?.[0]?.title || "Spice"}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs font-medium text-red">
                            ${suggestion.price.toFixed(2)}
                          </span>
                          {suggestion.discount && suggestion.discount > 0 && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs font-medium text-green-600">
                                {suggestion.discount}% off
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                {suggestions.length} result{suggestions.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </>
        ) : searchTerm.length >= 2 ? (
          <div className="p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <FiSearch className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">No results found</p>
            <p className="text-xs text-gray-500 mt-1">
              Try different keywords or check spelling
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchSuggestions;
