import Image from "next/image";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { cn } from "@/lib/utils";

interface EnhancedBannerProps {
  image: string;
  title: string;
  subtitle: string;
  className?: string;
  priority?: boolean;
  callToAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EnhancedBanner({
  image,
  title,
  subtitle,
  className,
  priority = false,
  callToAction,
}: Readonly<EnhancedBannerProps>) {
  return (
    <div
      className={cn(
        "w-full min-h-[280px] md:min-h-[350px] lg:min-h-[400px] bg-[#F6FFE9]",
        "relative overflow-hidden group mobile-optimized",
        className,
      )}
    >
      <div className="responsive-container h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-full items-center">
          {/* Image Section */}
          <div className="relative w-full h-[200px] md:h-[300px] lg:h-[350px] order-2 md:order-1 mobile-performance">
            <Suspense fallback={<BannerSkeleton />}>
              <Image
                src={image}
                alt={title}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover rounded-lg shadow-lg transition-all duration-500 group-hover:scale-105 reduce-motion:no-animations"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9kfa"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </Suspense>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center items-start space-y-4 md:space-y-6 order-1 md:order-2 text-center md:text-left responsive-padding">
            <h1 className="responsive-heading font-bold text-[#110011] leading-tight">
              {title}
            </h1>

            <p className="responsive-text text-[#737373] leading-relaxed max-w-md">
              {subtitle}
            </p>

            {callToAction && (
              <div className="pt-2">
                {callToAction.href ? (
                  <a
                    href={callToAction.href}
                    className="bg-[#73bf0a] hover:bg-[#5a9a08] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 mobile-touch-target high-contrast:enhanced-contrast"
                  >
                    {callToAction.text}
                  </a>
                ) : (
                  <button
                    onClick={callToAction.onClick}
                    className="bg-[#73bf0a] hover:bg-[#5a9a08] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 mobile-touch-target high-contrast:enhanced-contrast"
                  >
                    {callToAction.text}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#a1cf62]/20 rounded-full -translate-y-16 translate-x-16 reduce-motion:no-animations"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#f59300]/20 rounded-full translate-y-12 -translate-x-12 reduce-motion:no-animations"></div>

      {/* Performance overlay for LCP optimization */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6FFE9] via-transparent to-transparent opacity-50"></div>
      </div>
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400 responsive-text">Loading banner...</div>
    </div>
  );
}
