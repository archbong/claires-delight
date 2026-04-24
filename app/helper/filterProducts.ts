import { Product } from "@/typings";


  
  // Initialize filterCategoryMap when products are fetched or updated
export const initializeFilterCategoryMap = (state: any) => {
    const { products } = state;
    const map: Record<string, Product[]> = {};
  
    // Group products by category
    products.forEach((product: any) => {
      if (!map[product.category]) {
        map[product.category] = [];
      }
      map[product.category].push(product);
    });
  
    state.filterCategoryMap = map;
  };
  
  // Improved filterProducts using pre-built map
export const filterProducts = (state: any) => {
    const { filterCategoryMap, filterCategory } = state;
  
    // Check if map is initialized
    if (!filterCategoryMap) {
      initializeFilterCategoryMap(state);
    }
  
    // Filter based on category using pre-built map
    state.searchResults = filterCategoryMap[filterCategory] || [];
  };
  