import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/typings';

interface ProductsState {
  // Products data
  products: Product[];
  filteredProducts: Product[];
  featuredProducts: Product[];

  // Search and filter state
  searchTerm: string;
  sortOption: string;
  selectedCategory: string | null;
  priceRange: [number, number];

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setSearchTerm: (term: string) => void;
  updateSearchTerm: (term: string) => void;
  setSortOption: (option: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  filterProducts: () => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed values
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      filteredProducts: [],
      featuredProducts: [],
      searchTerm: '',
      sortOption: 'featured',
      selectedCategory: null,
      priceRange: [0, 1000],
      isLoading: false,
      error: null,

      // Actions
      setProducts: (products) => {
        // Filter featured products (products with isNew flag or high rating)
        const featuredProducts = products.filter(
          (product) => product.isNew || (product.rating && product.rating >= 4.5)
        );

        set({
          products,
          filteredProducts: products,
          featuredProducts,
          isLoading: false,
          error: null,
        });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
        get().filterProducts();
      },

      updateSearchTerm: (term) => {
        set({ searchTerm: term });
        get().filterProducts();
      },

      setSortOption: (option) => {
        set({ sortOption: option });
        get().filterProducts();
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
        get().filterProducts();
      },

      setPriceRange: (range) => {
        set({ priceRange: range });
        get().filterProducts();
      },

      filterProducts: () => {
        const { products, searchTerm, selectedCategory, priceRange, sortOption } = get();

        let filtered = [...products];

        // Filter by search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(term) ||
              product.description.toLowerCase().includes(term) ||
              product.category?.some((cat) => cat.title.toLowerCase().includes(term))
          );
        }

        // Filter by category
        if (selectedCategory) {
          filtered = filtered.filter((product) =>
            product.category?.some((cat) => cat.title === selectedCategory)
          );
        }

        // Filter by price range
        filtered = filtered.filter(
          (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sort products
        switch (sortOption) {
          case 'price-low-high':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'name-a-z':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-z-a':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'featured':
          default:
            // Keep original order for featured
            break;
        }

        set({ filteredProducts: filtered });
      },

      clearFilters: () => {
        set({
          searchTerm: '',
          selectedCategory: null,
          priceRange: [0, 1000],
          sortOption: 'featured',
        });
        get().filterProducts();
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Computed values (getters)
      getProductBySlug: (slug) => {
        return get().products.find((product) => product.slug === slug);
      },

      getProductsByCategory: (category) => {
        return get().products.filter((product) =>
          product.category?.some((cat) => cat.title === category)
        );
      },
    }),
    {
      name: 'products-storage',
      skipHydration: true,
      partialize: (state) => ({
        searchTerm: state.searchTerm,
        sortOption: state.sortOption,
        selectedCategory: state.selectedCategory,
        priceRange: state.priceRange,
      }),
    }
  )
);
