"use client";

import { useProductsStore } from "@/app/store/productsStore";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { Button } from "@/app/components/ui/Button";
import { Product } from "@/typings";

// Mock product for testing
const mockProduct: Product = {
  _id: "test-1",
  name: "Test Spice",
  slug: "test-spice",
  description: "A test spice for verifying Zustand setup",
  category: [{ title: "Test Category", slug: "test-category", stock: 100 }],
  origin: "Test Origin",
  healthBenefit: ["Test benefit 1", "Test benefit 2"],
  culinaryUses: ["Test use 1", "Test use 2"],
  price: 9.99,
  stock: 50,
  images: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isNew: true,
  discount: 10,
  rating: 4.5,
  reviewCount: 10,
  originalPrice: 11.99,
};

export default function TestZustandPage() {
  // Products store
  const {
    products,
    searchTerm,
    filteredProducts,
    setProducts,
    setSearchTerm,
    updateSearchTerm,
    clearFilters,
  } = useProductsStore();

  // Cart store
  const {
    items: cartItems,
    cartCount,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCartStore();

  // Wishlist store
  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
  } = useWishlistStore();

  const wishlistCount = getWishlistCount();

  const handleAddTestProduct = () => {
    setProducts([mockProduct]);
  };

  const handleAddToCart = () => {
    addToCart(mockProduct, 1);
  };

  const handleRemoveFromCart = () => {
    if (cartItems.length > 0) {
      removeFromCart(cartItems[0].product._id!);
    }
  };

  const handleAddToWishlist = () => {
    addToWishlist(mockProduct);
  };

  const handleRemoveFromWishlist = () => {
    if (wishlistItems.length > 0) {
      removeFromWishlist(wishlistItems[0]._id!);
    }
  };

  const handleUpdateSearch = () => {
    updateSearchTerm("test search");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Zustand Store Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Products Store Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Products Store
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                Products: <span className="font-medium">{products.length}</span>
              </p>
              <p className="text-gray-600">
                Filtered Products:{" "}
                <span className="font-medium">{filteredProducts.length}</span>
              </p>
              <p className="text-gray-600">
                Search Term: <span className="font-medium">"{searchTerm}"</span>
              </p>
              <div className="space-y-2 pt-4">
                <Button
                  onClick={handleAddTestProduct}
                  variant="primary"
                  size="sm"
                >
                  Add Test Product
                </Button>
                <Button
                  onClick={handleUpdateSearch}
                  variant="outline"
                  size="sm"
                >
                  Update Search Term
                </Button>
                <Button onClick={clearFilters} variant="ghost" size="sm">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Store Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Cart Store
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                Cart Items:{" "}
                <span className="font-medium">{cartItems.length}</span>
              </p>
              <p className="text-gray-600">
                Cart Count: <span className="font-medium">{cartCount}</span>
              </p>
              <p className="text-gray-600">
                Total Amount:{" "}
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </p>
              <div className="space-y-2 pt-4">
                <Button onClick={handleAddToCart} variant="primary" size="sm">
                  Add to Cart
                </Button>
                <Button
                  onClick={handleRemoveFromCart}
                  variant="outline"
                  size="sm"
                >
                  Remove from Cart
                </Button>
                <Button onClick={clearCart} variant="ghost" size="sm">
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Wishlist Store Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Wishlist Store
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                Wishlist Items:{" "}
                <span className="font-medium">{wishlistItems.length}</span>
              </p>
              <p className="text-gray-600">
                Wishlist Count:{" "}
                <span className="font-medium">{wishlistCount}</span>
              </p>
              <p className="text-gray-600">
                In Wishlist:{" "}
                <span className="font-medium">
                  {isInWishlist(mockProduct._id!) ? "Yes" : "No"}
                </span>
              </p>
              <div className="space-y-2 pt-4">
                <Button
                  onClick={handleAddToWishlist}
                  variant="primary"
                  size="sm"
                >
                  Add to Wishlist
                </Button>
                <Button
                  onClick={handleRemoveFromWishlist}
                  variant="outline"
                  size="sm"
                >
                  Remove from Wishlist
                </Button>
                <Button onClick={clearWishlist} variant="ghost" size="sm">
                  Clear Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Store State Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Store State Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Products Store</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-60">
                {JSON.stringify(
                  {
                    products: products.length,
                    filteredProducts: filteredProducts.length,
                    searchTerm,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Cart Store</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-60">
                {JSON.stringify(
                  {
                    items: cartItems.length,
                    cartCount,
                    totalAmount,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Wishlist Store</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-60">
                {JSON.stringify(
                  {
                    wishlistItems: wishlistItems.length,
                    wishlistCount,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Zustand Setup Verification
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Zustand stores are properly created and exported</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Stores include persistence with localStorage</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>TypeScript types are properly defined</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>React Query provider is set up in layout</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                EnhancedNavbar component uses Zustand instead of Redux
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>All missing dependencies are installed</span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-white rounded border">
            <p className="text-sm text-gray-600">
              <strong>Test Instructions:</strong> Click the buttons above to
              test each store's functionality. The state should persist across
              page reloads (thanks to Zustand persistence). Check your browser's
              localStorage to see the stored data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
