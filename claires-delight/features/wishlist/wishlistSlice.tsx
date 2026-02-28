// features/wishlist/wishlistSlice.tsx
// Kiro Requirement: WISHLIST-1.1, WISHLIST-1.2, WISHLIST-1.3 - Wishlist Item Management
// Kiro Requirement: WISHLIST-2.1, WISHLIST-2.2 - Wishlist Persistence
// Kiro Requirement: WISHLIST-3.1, WISHLIST-3.2 - Wishlist Synchronization
// Kiro Requirement: 4.1, 4.2, 4.3, 4.4 - Enhanced User Experience
// Kiro Requirement: 6.3 - Wishlist/Heart Functionality Implementation

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/typings";

export interface WishlistState {
  wishlistItems: Product[];
  loading: boolean;
  error: string | null;
  lastAction: {
    type: "add" | "remove" | "clear" | null;
    product: Product | null;
    timestamp: number | null;
  };
  pendingActions: {
    [productId: string]: {
      type: "add" | "remove";
      loading: boolean;
      error: string | null;
    };
  };
  notification: {
    type: "success" | "error" | "info" | null;
    message: string | null;
    product: Product | null;
  };
}

const initialState: WishlistState = {
  wishlistItems: [],
  loading: false,
  error: null,
  lastAction: {
    type: null,
    product: null,
    timestamp: null,
  },
  pendingActions: {},
  notification: {
    type: null,
    message: null,
    product: null,
  },
};

// Load wishlist from localStorage
const loadWishlistFromStorage = (): Product[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("wishlistItems");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
      return [];
    }
  }
  return [];
};

// Save wishlist to localStorage
const saveWishlistToStorage = (items: Product[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("wishlistItems", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }
};

// Initialize state with stored wishlist
const storedWishlist = loadWishlistFromStorage();
initialState.wishlistItems = storedWishlist;

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product: Product, { rejectWithValue }) => {
    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      return product;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to add product to wishlist",
      );
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return productId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to remove product from wishlist",
      );
    }
  },
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to clear wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlistLocal: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItemIndex = state.wishlistItems.findIndex(
        (item) => item._id === product._id,
      );

      if (existingItemIndex === -1) {
        state.wishlistItems.push(product);
        state.lastAction = {
          type: "add",
          product,
          timestamp: Date.now(),
        };
        state.notification = {
          type: "success",
          message: `${product.name} added to wishlist`,
          product,
        };
      }

      saveWishlistToStorage(state.wishlistItems);
    },

    removeFromWishlistLocal: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const removedItem = state.wishlistItems.find(
        (item) => item._id === productId,
      );

      if (removedItem) {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item._id !== productId,
        );
        state.lastAction = {
          type: "remove",
          product: removedItem,
          timestamp: Date.now(),
        };
        state.notification = {
          type: "info",
          message: `${removedItem.name} removed from wishlist`,
          product: removedItem,
        };
      }

      saveWishlistToStorage(state.wishlistItems);
    },

    clearWishlistLocal: (state) => {
      state.wishlistItems = [];
      state.lastAction = {
        type: "clear",
        product: null,
        timestamp: Date.now(),
      };
      state.notification = {
        type: "info",
        message: "Wishlist cleared",
        product: null,
      };
      saveWishlistToStorage(state.wishlistItems);
    },

    clearNotification: (state) => {
      state.notification = {
        type: null,
        message: null,
        product: null,
      };
    },

    clearError: (state) => {
      state.error = null;
    },

    clearPendingAction: (state, action: PayloadAction<string>) => {
      delete state.pendingActions[action.payload];
    },

    // Optimistic updates for immediate UI feedback
    optimisticAddToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItemIndex = state.wishlistItems.findIndex(
        (item) => item._id === product._id,
      );

      if (existingItemIndex === -1) {
        state.wishlistItems.push(product);
      }

      // Set pending action state
      state.pendingActions[product._id!] = {
        type: "add",
        loading: true,
        error: null,
      };
    },

    optimisticRemoveFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== productId,
      );

      state.pendingActions[productId] = {
        type: "remove",
        loading: true,
        error: null,
      };
    },

    // Sync wishlist with localStorage (useful for cross-tab synchronization)
    syncWishlist: (state) => {
      const storedItems = loadWishlistFromStorage();
      state.wishlistItems = storedItems;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state, action) => {
        const product = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.pendingActions[product._id!] = {
          type: "add",
          loading: true,
          error: null,
        };
      })
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const product = action.payload;

          // Clear pending action
          delete state.pendingActions[product._id!];

          // Update notification
          state.notification = {
            type: "success",
            message: `${product.name} added to wishlist`,
            product,
          };

          // Add product to wishlist if not already present
          const existingItemIndex = state.wishlistItems.findIndex(
            (item) => item._id === product._id,
          );

          if (existingItemIndex === -1) {
            state.wishlistItems.push(product);
          }

          state.lastAction = {
            type: "add",
            product,
            timestamp: Date.now(),
          };

          saveWishlistToStorage(state.wishlistItems);
        },
      )
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        const product = action.meta.arg;
        const error =
          (action.payload as string) || "Failed to add product to wishlist";

        // Set error state for specific product
        if (state.pendingActions[product._id!]) {
          state.pendingActions[product._id!] = {
            type: "add",
            loading: false,
            error,
          };
        }

        state.error = error;
        state.notification = {
          type: "error",
          message: error,
          product,
        };

        // Revert optimistic update
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item._id !== product._id,
        );
        saveWishlistToStorage(state.wishlistItems);
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state, action) => {
        const productId = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.pendingActions[productId] = {
          type: "remove",
          loading: true,
          error: null,
        };
      })
      .addCase(
        removeFromWishlist.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const productId = action.payload;

          // Clear pending action
          delete state.pendingActions[productId];

          // Remove product from wishlist
          state.wishlistItems = state.wishlistItems.filter(
            (item) => item._id !== productId,
          );

          state.lastAction = {
            type: "remove",
            product:
              state.wishlistItems.find((item) => item._id === productId) ||
              null,
            timestamp: Date.now(),
          };

          saveWishlistToStorage(state.wishlistItems);
        },
      )
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        const productId = action.meta.arg;
        const error =
          (action.payload as string) ||
          "Failed to remove product from wishlist";

        if (state.pendingActions[productId]) {
          state.pendingActions[productId] = {
            type: "remove",
            loading: false,
            error,
          };
        }

        state.error = error;
        state.notification = {
          type: "error",
          message: error,
          product: null,
        };
      })

      // Clear Wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.wishlistItems = [];
        state.lastAction = {
          type: "clear",
          product: null,
          timestamp: Date.now(),
        };
        state.notification = {
          type: "info",
          message: "Wishlist cleared",
          product: null,
        };
        saveWishlistToStorage(state.wishlistItems);
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        const error = (action.payload as string) || "Failed to clear wishlist";
        state.error = error;
        state.notification = {
          type: "error",
          message: error,
          product: null,
        };
      });
  },
});

export const {
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlistLocal,
  clearNotification,
  clearError,
  clearPendingAction,
  optimisticAddToWishlist,
  optimisticRemoveFromWishlist,
  syncWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
