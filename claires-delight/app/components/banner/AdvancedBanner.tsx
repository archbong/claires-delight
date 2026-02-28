import Image from "next/image";
import { Suspense, useRef, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { cn } from "@/lib/utils";

interface AdvancedBannerProps {
  image: string;
  title: string;
  subtitle: string;
  className?: string;
  priority?: boolean;
  enableParallax?: boolean;
  parallaxIntensity?: number;
  callToAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  overlayOpacity?: number;
  gradientDirection?: "left" | "right" | "top" | "bottom";
}

export default function AdvancedBanner({
  image,
  title,
  subtitle,
  className,
  priority = false,
  enableParallax = true,
  parallaxIntensity = 0.5,
  callToAction,
  overlayOpacity = 0.3,
  gradientDirection = "right",
}: Readonly<AdvancedBannerProps>) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!enableParallax || isMobile) return;

    const handleScroll = () => {
      if (!bannerRef.current) return;

      const rect = bannerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableParallax, isMobile]);

  const getGradientClass = () => {
    const directions = {
      left: "bg-gradient-to-r",
      right: "bg-gradient-to-l",
      top: "bg-gradient-to-b",
      bottom: "bg-gradient-to-t",
    };
    return directions[gradientDirection];
  };

  const parallaxTransform = enableParallax && !isMobile
    ? `translateY(${scrollProgress * parallaxIntensity * 50}px)`
    : undefined;

  return (
    <div
      ref={bannerRef}
      className={cn(
        "w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-[#F6FFE9]",
        "relative overflow-hidden group mobile-optimized",
        "transition-all duration-700 ease-out",
        className,
      )}
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <Suspense fallback={<BannerSkeleton />}>
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 reduce-motion:no-animations"
            style={{
              transform: parallaxTransform,
            }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9kfa"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </Suspense>
      </div>

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0",
          getGradientClass(),
          "from-[#F6FFE9] via-[#F6FFE9]/80 to-transparent",
        )}
        style={{ opacity: overlayOpacity }}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="responsive-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1
                  className="responsive-heading font-bold text-[#110011] leading-tight"
                  style={{
                    transform: enableParallax && !isMobile
                      ? `translateY(${scrollProgress * parallaxIntensity * -20}px)`
                      : undefined,
                    opacity: 1 - scrollProgress * 0.3,
                  }}
                >
                  {title}
                </h1>

                <p
                  className="responsive-text text-[#737373] leading-relaxed max-w-lg mx-auto lg:mx-0"
                  style={{
                    transform: enableParallax && !isMobile
                      ? `translateY(${scrollProgress * parallaxIntensity * -15}px)`
                      : undefined,
                    opacity: 1 - scrollProgress * 0.4,
                  }}
                >
                  {subtitle}
                </p>
              </div>

              {callToAction && (
                <div
                  className="pt-4"
                  style={{
                    transform: enableParallax && !isMobile
                      ? `translateY(${scrollProgress * parallaxIntensity * -10}px)`
                      : undefined,
                    opacity: 1 - scrollProgress * 0.5,
                  }}
                >
                  {callToAction.href ? (
                    <a
                      href={callToAction.href}
                      className="inline-block bg-[#73bf0a] hover:bg-[#5a9a08] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 mobile-touch-target high-contrast:enhanced-contrast shadow-lg hover:shadow-xl"
                    >
                      {callToAction.text}
                    </a>
                  ) : (
                    <button
                      onClick={callToAction.onClick}
                      className="bg-[#73bf0a] hover:bg-[#5a9a08] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 mobile-touch-target high-contrast:enhanced-contrast shadow-lg hover:shadow-xl"
                    >
                      {callToAction.text}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Optional Image Placeholder for larger screens */}
            <div className="hidden lg:block relative h-[300px] lg:h-[400px]">
              <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-[#737373] text-sm">Premium Spice Selection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated decorative elements */}
      <div className="absolute top-8 right-8 w-16 h-16 bg-[#a1cf62]/20 rounded-full animate-float reduce-motion:no-animations"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-[#f59300]/20 rounded-full animate-float-delayed reduce-motion:no-animations"></div>

      {/* Scroll indicator for desktop */}
      {enableParallax && !isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-[#737373]/30 rounded-full flex justify-center">
            <div
              className="w-1 h-3 bg-[#73bf0a] rounded-full mt-2 transition-transform duration-300"
              style={{ transform: `translateY(${scrollProgress * 16}px)` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 responsive-text">Loading premium banner...</div>
    </div>
  );
}
