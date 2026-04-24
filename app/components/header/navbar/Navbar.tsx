// Navbar.tsx - Backward compatibility wrapper for EnhancedNavbar
"use client";

import EnhancedNavbar from "./EnhancedNavbar";
import type { EnhancedNavbarProps } from "./EnhancedNavbar";

// Export the enhanced navbar as the default Navbar for backward compatibility
export default EnhancedNavbar;

// Re-export the props type for TypeScript compatibility
export type { EnhancedNavbarProps as NavbarProps };
