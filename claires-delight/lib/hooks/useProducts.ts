import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { productsAPI } from '../api/products';
import { Product } from '@/typings';
import { useProductsStore } from '@/app/store/productsStore';

// Query keys for products
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...productQueryKeys.lists(), { filters }] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productQueryKeys.details(), slug] as const,
  search: (query: string) => [...productQueryKeys.all, 'search', query] as const,
  featured: () => [...productQueryKeys.all, 'featured'] as const,
  byCategory: (category: string) => [...productQueryKeys.all, 'category', category] as const,
  categories: () => [...productQueryKeys.all, 'categories'] as const,
};

// Hook to fetch all products
export function useProducts(options?: UseQueryOptions<Product[], Error>) {
  const setProducts = useProductsStore((state) => state.setProducts);

  return useQuery<Product[], Error>({
    queryKey: productQueryKeys.lists(),
    queryFn: async () => {
      const products = await productsAPI.getAllProducts();
      // Update Zustand store with fetched products
      setProducts(products);
      return products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// Hook to fetch a single product by slug
export function useProduct(slug: string, options?: UseQueryOptions<Product, Error>) {
  return useQuery<Product, Error>({
    queryKey: productQueryKeys.detail(slug),
    queryFn: () => productsAPI.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// Hook to search products
export function useSearchProducts(query: string, options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: productQueryKeys.search(query),
    queryFn: () => productsAPI.searchProducts(query),
    enabled: !!query && query.trim().length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

// Hook to fetch featured products
export function useFeaturedProducts(options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: productQueryKeys.featured(),
    queryFn: () => productsAPI.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes for featured products
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

// Hook to fetch products by category
export function useProductsByCategory(category: string, options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: productQueryKeys.byCategory(category),
    queryFn: () => productsAPI.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// Hook to fetch categories
export function useCategories(options?: UseQueryOptions<string[], Error>) {
  return useQuery<string[], Error>({
    queryKey: productQueryKeys.categories(),
    queryFn: () => productsAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes for categories
    gcTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Hook to create a new product (admin only)
export function useCreateProduct(options?: UseMutationOptions<Product, Error, Partial<Product>>) {
  const queryClient = useQueryClient();
  const setProducts = useProductsStore((state) => state.setProducts);

  return useMutation<Product, Error, Partial<Product>>({
    mutationFn: (productData) => productsAPI.createProduct(productData),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });

      // Update Zustand store
      const currentProducts = useProductsStore.getState().products;
      setProducts([...currentProducts, newProduct]);
    },
    ...options,
  });
}

// Hook to update a product (admin only)
export function useUpdateProduct(options?: UseMutationOptions<Product, Error, { slug: string; data: Partial<Product> }>) {
  const queryClient = useQueryClient();
  const setProducts = useProductsStore((state) => state.setProducts);

  return useMutation<Product, Error, { slug: string; data: Partial<Product> }>({
    mutationFn: ({ slug, data }) => productsAPI.updateProduct(slug, data),
    onSuccess: (updatedProduct, variables) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(variables.slug) });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });

      // Update Zustand store
      const currentProducts = useProductsStore.getState().products;
      const updatedProducts = currentProducts.map(product =>
        product.slug === variables.slug ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
    },
    ...options,
  });
}

// Hook to delete a product (admin only)
export function useDeleteProduct(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();
  const setProducts = useProductsStore((state) => state.setProducts);

  return useMutation<void, Error, string>({
    mutationFn: (slug) => productsAPI.deleteProduct(slug),
    onSuccess: (_, slug) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });

      // Update Zustand store
      const currentProducts = useProductsStore.getState().products;
      const filteredProducts = currentProducts.filter(product => product.slug !== slug);
      setProducts(filteredProducts);
    },
    ...options,
  });
}

// Hook to prefetch products
export function usePrefetchProducts() {
  const queryClient = useQueryClient();

  return {
    prefetchAllProducts: () =>
      queryClient.prefetchQuery({
        queryKey: productQueryKeys.lists(),
        queryFn: () => productsAPI.getAllProducts(),
      }),
    prefetchProduct: (slug: string) =>
      queryClient.prefetchQuery({
        queryKey: productQueryKeys.detail(slug),
        queryFn: () => productsAPI.getProductBySlug(slug),
      }),
    prefetchFeaturedProducts: () =>
      queryClient.prefetchQuery({
        queryKey: productQueryKeys.featured(),
        queryFn: () => productsAPI.getFeaturedProducts(),
      }),
  };
}

// Hook to sync Zustand store with React Query cache
export function useSyncProductsStore() {
  const { data: products, isLoading, error } = useProducts();
  const setProducts = useProductsStore((state) => state.setProducts);

  // Sync Zustand store when products are loaded
  useEffect(() => {
    if (products && !isLoading && !error) {
      setProducts(products);
    }
  }, [products, isLoading, error, setProducts]);

  return { isLoading, error };
}
