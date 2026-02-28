// Search utilities for Claire's Delight

import { Product } from '@/typings';

/**
 * Search products by name, description, or category
 * @param products Array of products to search through
 * @param query Search query string
 * @param limit Maximum number of results to return (optional)
 * @returns Array of matching products
 */
export function searchProducts(
  products: Product[],
  query: string,
  limit?: number
): Product[] {
  if (!query.trim() || !products.length) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();

  // Score products based on search relevance
  const scoredProducts = products.map(product => {
    let score = 0;

    // Exact name match (highest priority)
    if (product.name.toLowerCase() === searchTerm) {
      score += 100;
    }

    // Name contains search term
    if (product.name.toLowerCase().includes(searchTerm)) {
      score += 50;
    }

    // Description contains search term
    if (product.description.toLowerCase().includes(searchTerm)) {
      score += 20;
    }

    // Category matches
    if (product.category?.some(cat =>
      cat.title.toLowerCase().includes(searchTerm) ||
      cat.slug.toLowerCase().includes(searchTerm)
    )) {
      score += 30;
    }

    // Origin matches
    if (product.origin.toLowerCase().includes(searchTerm)) {
      score += 15;
    }

    // Health benefits contain search term
    if (product.healthBenefit?.some(benefit =>
      benefit.toLowerCase().includes(searchTerm)
    )) {
      score += 10;
    }

    // Culinary uses contain search term
    if (product.culinaryUses?.some(use =>
      use.toLowerCase().includes(searchTerm)
    )) {
      score += 10;
    }

    return { product, score };
  });

  // Filter out products with no matches and sort by score
  const filtered = scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

  // Apply limit if specified
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Filter products by category
 * @param products Array of products to filter
 * @param category Category to filter by
 * @returns Array of products in the specified category
 */
export function filterProductsByCategory(
  products: Product[],
  category: string
): Product[] {
  if (!category.trim() || !products.length) {
    return [];
  }

  const categoryLower = category.toLowerCase().trim();

  return products.filter(product =>
    product.category?.some(cat =>
      cat.title.toLowerCase().includes(categoryLower) ||
      cat.slug.toLowerCase().includes(categoryLower)
    )
  );
}

/**
 * Filter products by price range
 * @param products Array of products to filter
 * @param minPrice Minimum price (inclusive)
 * @param maxPrice Maximum price (inclusive)
 * @returns Array of products within the price range
 */
export function filterProductsByPrice(
  products: Product[],
  minPrice: number,
  maxPrice: number
): Product[] {
  if (!products.length) {
    return [];
  }

  return products.filter(product => {
    const price = product.discount ?
      product.price * (1 - product.discount / 100) :
      product.price;

    return price >= minPrice && price <= maxPrice;
  });
}

/**
 * Sort products by various criteria
 * @param products Array of products to sort
 * @param sortBy Sort criteria: 'name', 'price-low', 'price-high', 'rating', 'newest'
 * @returns Sorted array of products
 */
export function sortProducts(
  products: Product[],
  sortBy: string = 'name'
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      });

    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceB - priceA;
      });

    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

/**
 * Get unique categories from products
 * @param products Array of products
 * @returns Array of unique category names
 */
export function getUniqueCategories(products: Product[]): string[] {
  const categories = new Set<string>();

  products.forEach(product => {
    product.category?.forEach(cat => {
      categories.add(cat.title);
    });
  });

  return Array.from(categories).sort();
}

/**
 * Generate search suggestions based on popular searches and product names
 * @param products Array of products
 * @param query Current search query
 * @param limit Maximum number of suggestions (default: 5)
 * @returns Array of search suggestion strings
 */
export function generateSearchSuggestions(
  products: Product[],
  query: string,
  limit: number = 5
): string[] {
  if (!query.trim() || !products.length) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  // Add product names that match the query
  products.forEach(product => {
    if (product.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.name);
    }
  });

  // Add category names that match the query
  products.forEach(product => {
    product.category?.forEach(cat => {
      if (cat.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(cat.title);
      }
    });
  });

  // Add common search terms based on the query
  const commonTerms = [
    'organic',
    'premium',
    'spices',
    'herbs',
    'seasoning',
    'powder',
    'whole',
    'ground'
  ];

  commonTerms.forEach(term => {
    if (term.includes(searchTerm) || searchTerm.includes(term)) {
      suggestions.add(term.charAt(0).toUpperCase() + term.slice(1));
    }
  });

  return Array.from(suggestions).slice(0, limit);
}
