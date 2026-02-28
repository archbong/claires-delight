// features/cart/cartSlice.ts
// Kiro Requirement: CART-1.1, CART-1.2, CART-1.3 - Cart Item Management
// Kiro Requirement: CART-2.1, CART-2.2 - Cart Persistence
// Kiro Requirement: CART-3.1, CART-3.2, CART-3.3 - Cart Calculations and Totals
// Kiro Requirement: 4.1, 4.2, 4.3, 4.4 - Enhanced User Experience
// Kiro Requirement: 6.1 - Enhanced Add-to-Cart Experience

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/typings";

export interface CartState {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  loading: boolean;
  error: string | null;
  lastAddedItem: Product | null;
  pendingActions: {
    [productId: string]: {
      type: "add" | "remove" | "update";
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

const initialState: CartState = {
  cartItems: [],
  cartTotal: 0,
  cartCount: 0,
  loading: false,
  error: null,
  lastAddedItem: null,
  pendingActions: {},
  notification: {
    type: null,
    message: null,
    product: null,
  },
};

// Kiro Requirement: CART-3.1 - Calculate cart totals accurately
const updateCartTotals = (state: CartState) => {
  state.cartTotal = state.cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  state.cartCount = state.cartItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );
};

const updateLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }
};

// Kiro Requirement: CART-1.1 - Add items to cart with quantity handling
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product: Product, { rejectWithValue }) => {
    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      return product;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to add product to cart",
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return productId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to remove product from cart",
      );
    }
  },
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update quantity",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingCartItemIndex = state.cartItems.findIndex(
        (item) => item.product._id === product._id,
      );

      if (existingCartItemIndex !== -1) {
        state.cartItems[existingCartItemIndex].quantity += 1;
      } else {
        state.cartItems.push({ product, quantity: 1 });
      }

      state.lastAddedItem = product;
      state.notification = {
        type: "success",
        message: `${product.name} added to cart`,
        product,
      };

      updateLocalStorage(state.cartItems);
      updateCartTotals(state);
    },

    removeFromCartLocal: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const removedItem = state.cartItems.find(
        (item) => item.product._id === productId,
      );

      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== productId,
      );

      if (removedItem) {
        state.notification = {
          type: "info",
          message: `${removedItem.product.name} removed from cart`,
          product: removedItem.product,
        };
      }

      updateLocalStorage(state.cartItems);
      updateCartTotals(state);
    },

    updateCartItemQuantityLocal: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const existingCartItemIndex = state.cartItems.findIndex(
        (item) => item.product._id === productId,
      );

      if (existingCartItemIndex !== -1) {
        state.cartItems[existingCartItemIndex].quantity = quantity;
        updateLocalStorage(state.cartItems);
        updateCartTotals(state);
      }
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

    // Optimistic update for immediate UI feedback
    optimisticAddToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingCartItemIndex = state.cartItems.findIndex(
        (item) => item.product._id === product._id,
      );

      if (existingCartItemIndex !== -1) {
        state.cartItems[existingCartItemIndex].quantity += 1;
      } else {
        state.cartItems.push({ product, quantity: 1 });
      }

      state.lastAddedItem = product;
      updateCartTotals(state);

      // Set pending action state
      state.pendingActions[product._id!] = {
        type: "add",
        loading: true,
        error: null,
      };
    },

    optimisticRemoveFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== productId,
      );
      updateCartTotals(state);

      state.pendingActions[productId] = {
        type: "remove",
        loading: true,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state, action) => {
        const product = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.pendingActions[product._id!] = {
          type: "add",
          loading: true,
          error: null,
        };
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const product = action.payload;

        // Clear pending action
        delete state.pendingActions[product._id!];

        // Update notification
        state.notification = {
          type: "success",
          message: `${product.name} added to cart`,
          product,
        };

        updateLocalStorage(state.cartItems);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        const product = action.meta.arg;
        const error =
          (action.payload as string) || "Failed to add product to cart";

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

        // Revert optimistic update if it was made
        const existingItemIndex = state.cartItems.findIndex(
          (item) => item.product._id === product._id,
        );
        if (existingItemIndex !== -1) {
          if (state.cartItems[existingItemIndex].quantity > 1) {
            state.cartItems[existingItemIndex].quantity -= 1;
          } else {
            state.cartItems.splice(existingItemIndex, 1);
          }
          updateCartTotals(state);
        }
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state, action) => {
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
        removeFromCart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const productId = action.payload;

          // Clear pending action
          delete state.pendingActions[productId];

          updateLocalStorage(state.cartItems);
        },
      )
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        const productId = action.meta.arg;
        const error =
          (action.payload as string) || "Failed to remove product from cart";

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

      // Update Quantity
      .addCase(updateCartItemQuantity.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.pendingActions[productId] = {
          type: "update",
          loading: true,
          error: null,
        };
      })
      .addCase(
        updateCartItemQuantity.fulfilled,
        (
          state,
          action: PayloadAction<{ productId: string; quantity: number }>,
        ) => {
          state.loading = false;
          const { productId } = action.payload;

          // Clear pending action
          delete state.pendingActions[productId];

          updateLocalStorage(state.cartItems);
        },
      )
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        const { productId } = action.meta.arg;
        const error = (action.payload as string) || "Failed to update quantity";

        if (state.pendingActions[productId]) {
          state.pendingActions[productId] = {
            type: "update",
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
      });
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  updateCartItemQuantityLocal,
  clearNotification,
  clearError,
  clearPendingAction,
  optimisticAddToCart,
  optimisticRemoveFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
