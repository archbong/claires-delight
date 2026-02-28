import { spiceBanner } from "@/public/image/cdn/cdn";
import EnhancedBanner from "./EnhancedBanner";
import AdvancedBanner from "./AdvancedBanner";

export default function BannerDemo() {
  return (
    <div className="space-y-12 py-12">
      {/* Enhanced Banner Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[#110011]">Enhanced Banner</h2>
        <div className="border-2 border-dashed border-[#a1cf62] rounded-lg p-4">
          <EnhancedBanner
            image={spiceBanner}
            title="Shop Spices"
            subtitle="Check out our spice shop for all your cooking needs. Find the perfect flavours to make your meals delicious"
            priority={false}
            callToAction={{
              text: "Explore Spices",
              href: "#spices",
              onClick: () => {
                const spicesSection = document.getElementById("spices");
                spicesSection?.scrollIntoView({ behavior: "smooth" });
              },
            }}
          />
        </div>
        <div className="bg-[#f6ffe9] p-4 rounded-lg">
          <h3 className="font-semibold text-[#110011] mb-2">Features:</h3>
          <ul className="text-sm text-[#737373] space-y-1">
            <li>• Responsive grid layout with mobile optimization</li>
            <li>• Next.js Image component with WebP optimization</li>
            <li>• Proper loading states and error handling</li>
            <li>• Responsive typography using utility classes</li>
            <li>• Mobile touch targets and accessibility support</li>
            <li>• Performance optimizations with blur placeholders</li>
          </ul>
        </div>
      </section>

      {/* Advanced Banner Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[#110011]">Advanced Banner (with Parallax)</h2>
        <div className="border-2 border-dashed border-[#f59300] rounded-lg p-4">
          <AdvancedBanner
            image={spiceBanner}
            title="Premium Spice Collection"
            subtitle="Discover our hand-selected organic spices from around the world. Elevate your cooking with authentic flavors and aromas."
            priority={false}
            enableParallax={true}
            parallaxIntensity={0.7}
            overlayOpacity={0.4}
            gradientDirection="right"
            callToAction={{
              text: "View Collection",
              href: "#spices",
              onClick: () => {
                const spicesSection = document.getElementById("spices");
                spicesSection?.scrollIntoView({ behavior: "smooth" });
              },
            }}
          />
        </div>
        <div className="bg-[#fff8f6] p-4 rounded-lg">
          <h3 className="font-semibold text-[#110011] mb-2">Advanced Features:</h3>
          <ul className="text-sm text-[#737373] space-y-1">
            <li>• Parallax scrolling effects (desktop only)</li>
            <li>• Gradient overlays with customizable opacity</li>
            <li>• Animated decorative elements with floating effects</li>
            <li>• Scroll progress indicator</li>
            <li>• Mobile detection for optimized performance</li>
            <li>• Enhanced visual hierarchy and spacing</li>
            <li>• Reduced motion support for accessibility</li>
            <li>• High contrast mode compatibility</li>
          </ul>
        </div>
      </section>

      {/* Comparison Notes */}
      <section className="bg-[#f6ffe9] p-6 rounded-lg border border-[#a1cf62]">
        <h3 className="font-bold text-[#110011] mb-4">Implementation Notes:</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-[#737373]">
          <div>
            <h4 className="font-semibold text-[#73bf0a] mb-2">Enhanced Banner</h4>
            <ul className="space-y-2">
              <li>• Better performance with optimized images</li>
              <li>• Responsive design for all screen sizes</li>
              <li>• Clean, modern layout with brand colors</li>
              <li>• Perfect for content-focused sections</li>
              <li>• Lower resource consumption</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#f59300] mb-2">Advanced Banner</h4>
            <ul className="space-y-2">
              <li>• Engaging visual effects and animations</li>
              <li>• Parallax creates depth and immersion</li>
              <li>• Ideal for hero sections and landing pages</li>
              <li>• Enhanced user engagement</li>
              <li>• More resource-intensive (use sparingly)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-[#a1cf62]/20 rounded">
          <p className="text-xs text-[#737373]">
            <strong>Recommendation:</strong> Use Enhanced Banner for most content sections.
            Reserve Advanced Banner for key hero sections where visual impact is critical.
          </p>
        </div>
      </section>
    </div>
  );
}
