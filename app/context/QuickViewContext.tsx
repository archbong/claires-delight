
"use client";

import React, { createContext, useContext, useCallback, useState, ReactNode } from "react";
import { Product } from "@/typings";
import QuickViewModal from "@/app/components/Spice/QuickViewModal";

interface QuickViewContextType {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isOpen: boolean;
  currentProduct: Product | null;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

interface QuickViewProviderProps {
  children: ReactNode;
  onAddToWishlist?: (product: Product) => void;
}

export const QuickViewProvider: React.FC<QuickViewProviderProps> = ({
  children,
  onAddToWishlist
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((product: Product) => {
    setCurrentProduct(product);
    setIsOpen(true);

    // Add to recently viewed (optional)
    if (typeof window !== 'undefined') {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [product, ...recentlyViewed.filter((p: Product) => p._id !== product._id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    // Don't clear product immediately to allow smooth closing animation
    setTimeout(() => setCurrentProduct(null), 300);
  }, []);

  const value: QuickViewContextType = {
    openQuickView,
    closeQuickView,
    isOpen,
    currentProduct
  };

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <QuickViewModal
        product={currentProduct}
        isOpen={isOpen}
        onClose={closeQuickView}
      />
    </QuickViewContext.Provider>
  );
};

export const useQuickView = (): QuickViewContextType => {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
};

// Hook for individual components to easily access quick view functionality
export const useQuickViewAction = () => {
  const { openQuickView } = useQuickView();
  return openQuickView;
};

export default QuickViewContext;
