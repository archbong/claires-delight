// Minimal store.ts file to satisfy TypeScript imports
// This is a temporary solution until Redux is properly migrated to Zustand

export interface RootState {
  wishlist: {
    wishlistItems: Array<{ id: string | number }>;
  };
  cart: {
    items: Array<{ id: string | number }>;
    notification?: {
      product?: { id: string | number; name: string };
      type?: string;
    };
  };
  products: {
    products: Array<{ id: string | number }>;
    searchTerm: string;
    sortOption: string;
  };
}

export type AppDispatch = any;

// Create a minimal store instance for TypeScript compatibility
export const store = {
  getState: (): RootState => ({
    wishlist: {
      wishlistItems: [],
    },
    cart: {
      items: [],
    },
    products: {
      products: [],
      searchTerm: '',
      sortOption: '',
    },
  }),
  dispatch: (action: any) => action,
  subscribe: (listener: () => void) => () => {},
  replaceReducer: (nextReducer: any) => {},
};
