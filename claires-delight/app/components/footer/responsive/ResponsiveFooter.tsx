"use client";

import Footer from "../Footer";
import FooterMobile from "../FooterMobile";
import FooterTab from "../FooterTab";

/**
 * ResponsiveFooter Component
 *
 * A reusable component that renders the appropriate footer based on screen size.
 * Uses CSS-based responsive design to ensure only one footer is visible at any time.
 *
 * Breakpoints (from tailwind.config.ts):
 * - Mobile: < 768px (md)
 * - Tablet: 768px - 991px (md to lg)
 * - Desktop: ≥ 992px (lg)
 */
export default function ResponsiveFooter() {
  return (
    <div>
      {/* Desktop Footer (lg screens and up) */}
      <div className="hidden lg:block" data-testid="desktop-footer">
        <Footer />
      </div>

      {/* Tablet Footer (md screens only) */}
      <div className="hidden md:block lg:hidden" data-testid="tablet-footer">
        <FooterTab />
      </div>

      {/* Mobile Footer (sm screens and down) */}
      <div className="block md:hidden" data-testid="mobile-footer">
        <FooterMobile />
      </div>
    </div>
  );
}
