// Kiro Requirement: 4.4 - Visual Feedback
// Kiro Requirement: 7.3 - Loading Skeletons and Placeholders
// Kiro Requirement: 6.1 - Enhanced Add-to-Cart Experience

"use client";

interface ProductGridSkeletonProps {
  count?: number;
  variant?: "grid" | "list";
  className?: string;
}

export default function ProductGridSkeleton({
  count = 12,
  variant = "grid",
  className = "",
}: ProductGridSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {skeletons.map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-primaryGrey"
          >
            {/* Image skeleton */}
            <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />

            {/* Content skeleton */}
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>

              {/* Actions skeleton */}
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 ${className}`}
    >
      {skeletons.map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-primaryGrey overflow-hidden h-full flex flex-col animate-pulse"
        >
          {/* Image skeleton */}
          <div className="bg-gray-200 p-4 flex-1 flex flex-col">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-300" />
          </div>

          {/* Content skeleton */}
          <div className="p-4 flex flex-col flex-1 space-y-3">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-4/5" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>

            {/* Price and button skeleton */}
            <div className="flex justify-between items-center mt-auto pt-3">
              <div className="h-7 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-9 bg-gray-200 rounded-lg animate-pulse w-20" />
            </div>
          </div>

          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
