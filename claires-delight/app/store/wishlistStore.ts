import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/typings";

interface WishlistState {
  // Wishlist items
  wishlistItems: Product[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed values
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      // Initial state
      wishlistItems: [],
      isLoading: false,
      error: null,

      // Actions
      addToWishlist: (product) => {
        const { wishlistItems } = get();

        // Check if product is already in wishlist
        const isAlreadyInWishlist = wishlistItems.some(
          (item) => item._id === product._id,
        );

        if (!isAlreadyInWishlist) {
          set((state) => ({
            wishlistItems: [...state.wishlistItems, product],
          }));
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(
            (item) => item._id !== productId,
          ),
        }));
      },

      clearWishlist: () => {
        set({ wishlistItems: [] });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Computed values (getters)
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item._id === productId);
      },

      getWishlistCount: () => {
        const { wishlistItems } = get();
        return wishlistItems.length;
      },
    }),
    {
      name: "wishlist-storage",
      skipHydration: true,
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
      }),
    },
  ),
);
