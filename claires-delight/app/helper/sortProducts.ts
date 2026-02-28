export const sortProducts = (state: any) => {
    const { sortOption, searchResults } = state;
  
    switch (sortOption) {
      case 'Recently Added':
        state.searchResults.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'Best Selling':
        // Placeholder for custom sorting logic based on sales data
        state.searchResults.sort((a: any, b: any) => {/* Custom logic */});
        break;
      case 'Alphabetically A-Z':
        state.searchResults.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetically Z-A':
        state.searchResults.sort((a: any, b: any) => b.name.localeCompare(a.name));
        break;
      case 'Price Low to High':
        state.searchResults.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'Price High to Low':
        state.searchResults.sort((a: any, b: any) => b.price - a.price);
        break;
      default:
        // Default to recently added if no valid sort option is provided
        state.searchResults.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  };
  
//   Time Complexity:
//    𝑂( 𝑛log ⁡ 𝑛), where 𝑛 is the number of products (state.searchResults or state.products).
//   Explanation: 
//   Sorting operations using JavaScript's Array.sort typically utilize algorithms like Quick Sort, which has an average time complexity of 
//   O(nlogn). This is efficient for moderate-sized arrays but could be slower for very large datasets.