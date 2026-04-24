"use client";

import { ReactNode, useEffect } from "react";
import { useProductsStore } from "@/app/store/productsStore";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useProducts } from "@/lib/hooks/useProducts";
import { QuickViewProvider } from "@/app/context/QuickViewContext";
import CartNotification from "@/app/components/notification/CartNotification";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const setProductsLoading = useProductsStore((state) => state.setLoading);
  const setProductsError = useProductsStore((state) => state.setError);

  const { isLoading, error } = useProducts();

  useEffect(() => {
    useProductsStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setProductsLoading(isLoading);
  }, [isLoading, setProductsLoading]);

  useEffect(() => {
    setProductsError(error?.message ?? null);
  }, [error, setProductsError]);

  return (
    <QuickViewProvider>
      {children}
      <CartNotification />
    </QuickViewProvider>
  );
}

export function useInitializeStores() {
  const initializeProductsStore = useProductsStore((state) => state.setProducts);
  const initializeCartStore = useCartStore((state) => state.setLoading);
  const initializeWishlistStore = useWishlistStore((state) => state.setLoading);

  return {
    initializeProductsStore,
    initializeCartStore,
    initializeWishlistStore,
  };
}

export function useResetStores() {
  const resetProductsStore = useProductsStore((state) => state.clearFilters);
  const resetCartStore = useCartStore((state) => state.clearCart);
  const resetWishlistStore = useWishlistStore((state) => state.clearWishlist);

  const resetAllStores = () => {
    resetProductsStore();
    resetCartStore();
    resetWishlistStore();
  };

  return { resetAllStores };
}

export function useStoreSnapshot() {
  const productsState = useProductsStore((state) => ({
    products: state.products,
    searchTerm: state.searchTerm,
    filteredProducts: state.filteredProducts,
  }));

  const cartState = useCartStore((state) => ({
    items: state.items,
    cartCount: state.cartCount,
    totalAmount: state.totalAmount,
  }));

  const wishlistState = useWishlistStore((state) => ({
    wishlistItems: state.wishlistItems,
    wishlistCount: state.getWishlistCount(),
  }));

  return {
    products: productsState,
    cart: cartState,
    wishlist: wishlistState,
    timestamp: new Date().toISOString(),
  };
}
