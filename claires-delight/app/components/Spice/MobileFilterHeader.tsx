"use client";

import { useState } from "react";
import { MdFilterList, MdClose } from "react-icons/md";
import { FiX } from "react-icons/fi";

interface MobileFilterHeaderProps {
  appliedFilters: string[];
  onClearAll: () => void;
  onRemoveFilter: (filterName: string) => void;
  onOpenFilters: () => void;
  resultsCount?: number;
}

const MobileFilterHeader: React.FC<MobileFilterHeaderProps> = ({
  appliedFilters,
  onClearAll,
  onRemoveFilter,
  onOpenFilters,
  resultsCount
}) => {
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-primaryGrey">
      {/* Main Filter Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-4 py-2 border border-primaryGrey rounded-lg hover:bg-lighterGreen transition-colors"
          >
            <MdFilterList className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {appliedFilters.length > 0 && (
              <span className="bg-orange text-white text-xs px-2 py-1 rounded-full min-w-[20px]">
                {appliedFilters.length}
              </span>
            )}
          </button>

          {resultsCount !== undefined && (
            <span className="text-tertiaryGrey text-sm">
              {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {appliedFilters.length > 0 && (
          <button
            onClick={() => setShowAppliedFilters(!showAppliedFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={showAppliedFilters ? "Hide applied filters" : "Show applied filters"}
          >
            {showAppliedFilters ? (
              <MdClose className="w-5 h-5" />
            ) : (
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-orange flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {appliedFilters.length}
                  </span>
                </div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Applied Filters Dropdown */}
      {showAppliedFilters && appliedFilters.length > 0 && (
        <div className="border-t border-primaryGrey bg-lighterGreen p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Applied Filters:</h4>
            <button
              onClick={onClearAll}
              className="text-orange text-sm hover:underline font-medium"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-full text-sm border border-primaryGrey shadow-sm"
              >
                <span className="text-customBlack">{filter}</span>
                <button
                  onClick={() => onRemoveFilter(filter)}
                  className="text-tertiaryGrey hover:text-red transition-colors"
                  aria-label={`Remove ${filter} filter`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      {appliedFilters.length > 0 && !showAppliedFilters && (
        <div className="border-t border-primaryGrey p-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-tertiaryGrey">
              {appliedFilters.length} filter{appliedFilters.length !== 1 ? 's' : ''} applied
            </span>
            <button
              onClick={onClearAll}
              className="text-orange text-sm hover:underline font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFilterHeader;
