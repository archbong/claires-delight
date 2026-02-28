import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/typings';

interface CartNotification {
  type: 'success' | 'error' | 'info' | null;
  message: string | null;
  product: Product | null;
}

interface CartState {
  // Cart items
  items: CartItem[];

  // Cart metadata
  cartCount: number;
  totalAmount: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;

  // UI state
  isCartOpen: boolean;
  isLoading: boolean;
  error: string | null;
  notification: CartNotification;

  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearNotification: () => void;

  // Computed values
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      cartCount: 0,
      totalAmount: 0,
      discountAmount: 0,
      shippingCost: 0,
      taxAmount: 0,
      isCartOpen: false,
      isLoading: false,
      error: null,
      notification: {
        type: null,
        message: null,
        product: null,
      },

      // Actions
      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.product._id === product._id
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };

          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            product,
            quantity,
          };
          set({ items: [...items, newItem] });
        }

        // Recalculate totals
        get().calculateTotals();
        set({
          notification: {
            type: 'success',
            message: `${product.name} added to cart`,
            product,
          },
        });
      },

      removeFromCart: (productId) => {
        const { items } = get();
        const removedItem = items.find((item) => item.product._id === productId);
        const updatedItems = items.filter(
          (item) => item.product._id !== productId
        );

        set({ items: updatedItems });
        get().calculateTotals();
        if (removedItem) {
          set({
            notification: {
              type: 'info',
              message: `${removedItem.product.name} removed from cart`,
              product: removedItem.product,
            },
          });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const { items } = get();
        const updatedItems = items.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );

        set({ items: updatedItems });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          cartCount: 0,
          totalAmount: 0,
          discountAmount: 0,
          shippingCost: 0,
          taxAmount: 0,
          notification: {
            type: 'info',
            message: 'Cart cleared',
            product: null,
          },
        });
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      openCart: () => {
        set({ isCartOpen: true });
      },

      closeCart: () => {
        set({ isCartOpen: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) =>
        set({
          error,
          notification: error
            ? {
                type: 'error',
                message: error,
                product: null,
              }
            : {
                type: null,
                message: null,
                product: null,
              },
        }),

      clearNotification: () =>
        set({
          notification: {
            type: null,
            message: null,
            product: null,
          },
        }),

      // Computed values (getters)
      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      isInCart: (productId) => {
        const { items } = get();
        return items.some((item) => item.product._id === productId);
      },

      calculateTotals: () => {
        const { items } = get();

        // Calculate subtotal
        const subtotal = items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );

        // Calculate cart count
        const cartCount = items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        // Calculate discount (example: 10% off for orders over $50)
        const discountAmount = subtotal > 50 ? subtotal * 0.1 : 0;

        // Calculate shipping (example: free shipping over $100, otherwise $10)
        const shippingCost = subtotal > 100 ? 0 : 10;

        // Calculate tax (example: 8% sales tax)
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * 0.08;

        // Calculate total
        const totalAmount = subtotal - discountAmount + shippingCost + taxAmount;

        set({
          cartCount,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          shippingCost: parseFloat(shippingCost.toFixed(2)),
          taxAmount: parseFloat(taxAmount.toFixed(2)),
        });
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.calculateTotals();
      },
    }
  )
);
