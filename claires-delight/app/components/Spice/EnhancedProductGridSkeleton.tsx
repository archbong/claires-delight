"use client";
import { FC } from "react";

interface EnhancedProductGridSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list';
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
}

const EnhancedProductGridSkeleton: FC<EnhancedProductGridSkeletonProps> = ({
  count = 12,
  variant = 'grid',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    xl: 4
  }
}) => {
  // Grid variant skeleton
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-${columns.mobile} xs:grid-cols-2 sm:grid-cols-${columns.tablet} md:grid-cols-${columns.desktop} lg:grid-cols-${columns.desktop} xl:grid-cols-${columns.xl} gap-4 sm:gap-5 md:gap-6`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="w-full bg-white rounded-xl shadow-sm border border-primaryGrey overflow-hidden animate-pulse"
          >
            {/* Image Skeleton with shimmer effect */}
            <div className="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer">
              <div className="absolute inset-0 bg-gray-200/50 rounded-t-xl" />
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Title Skeleton */}
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />

              {/* Price Skeleton */}
              <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />

              {/* Button Area Skeleton */}
              <div className="flex justify-between items-center mt-4 pt-2">
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-20" />
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List variant skeleton
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-primaryGrey animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="w-full sm:w-32 h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-3">
            {/* Title Skeleton */}
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-full" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-2/3" />
            </div>

            {/* Price and Actions Skeleton */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-20" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedProductGridSkeleton;
