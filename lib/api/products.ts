import { Product } from '@/typings';

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : '/api';

// API endpoints
const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  productBySlug: (slug: string) => `${API_BASE_URL}/products/${slug}`,
  productsByCategory: (category: string) => `${API_BASE_URL}/products/category/${category}`,
  searchProducts: (query: string) => `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
  featuredProducts: `${API_BASE_URL}/products/featured`,
  categories: `${API_BASE_URL}/categories`,
};

// Fetch wrapper with error handling
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Product API functions
export const productsAPI = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    return fetchAPI<Product[]>(API_ENDPOINTS.products);
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    return fetchAPI<Product>(API_ENDPOINTS.productBySlug(slug));
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return fetchAPI<Product[]>(API_ENDPOINTS.productsByCategory(category));
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    if (!query.trim()) return [];
    return fetchAPI<Product[]>(API_ENDPOINTS.searchProducts(query));
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    return fetchAPI<Product[]>(API_ENDPOINTS.featuredProducts);
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    return fetchAPI<string[]>(API_ENDPOINTS.categories);
  },

  // Create product (admin only)
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    return fetchAPI<Product>(API_ENDPOINTS.products, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (admin only)
  updateProduct: async (slug: string, productData: Partial<Product>): Promise<Product> => {
    return fetchAPI<Product>(API_ENDPOINTS.productBySlug(slug), {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (admin only)
  deleteProduct: async (slug: string): Promise<void> => {
    await fetchAPI<void>(API_ENDPOINTS.productBySlug(slug), {
      method: 'DELETE',
    });
  },
};

export default productsAPI;
