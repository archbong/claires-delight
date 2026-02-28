// app/loading.tsx
// Kiro Requirement: 7.3 - Add loading skeletons and placeholders
// Kiro Requirement: 4.1 - Modern UI/UX Patterns
// Kiro Requirement: 4.4 - Visual Feedback

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-primaryGrey">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Skeleton */}
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Navigation Skeleton */}
            <div className="hidden md:flex items-center gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-6 w-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header Skeleton */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm border border-primaryGrey"
                >
                  {/* Image Skeleton */}
                  <div className="bg-lighterGreen p-4 rounded-lg mb-4">
                    <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>

                    {/* Price and Actions Skeleton */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/5 animate-pulse"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Spacing */}
          <div className="h-8 md:h-16"></div>
        </div>
      </div>
    </div>
  );
}
