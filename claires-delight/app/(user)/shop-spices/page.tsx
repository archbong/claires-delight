"use client";

import { spiceBanner } from "@/public/image/cdn/cdn";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import Navbar from "@/app/components/header/navbar/Navbar";
import EnhancedSpiceList from "@/app/components/Spice/EnhancedSpiceList";
import SearchProductResults from "@/app/components/Spice/SearchProductResult";
import { useProductsStore } from "@/app/store/productsStore";
import Banner from "@/app/components/banner/Banner";

export default function Page() {
  const searchTerm = useProductsStore((state) => state.searchTerm);
  const searchResults = useProductsStore((state) => state.filteredProducts);
  const setSearchTerm = useProductsStore((state) => state.setSearchTerm);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      {searchTerm ? (
        <SearchProductResults results={searchResults} />
      ) : (
        <>
          {/* <section
            className="mt-20 px-4 sm:px-6 lg:px-8 py-16 text-white bg-cover bg-center"
            style={{ backgroundImage: `url(${spiceBanner})` }}
          >
            <div className="max-w-4xl mx-auto text-center space-y-4 bg-black/40 p-6 rounded-xl">
              <h1 className="text-3xl sm:text-4xl font-bold">Shop Premium Spices</h1>
              <p className="text-sm sm:text-base">
                Discover our hand-selected collection of organic spices from around the world.
                Elevate your cooking with authentic flavors and aromas.
              </p>
              <button
                className="btn bg-orange hover:bg-green text-white border-none"
                onClick={() => {
                  const spicesSection = document.getElementById("spices");
                  spicesSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Our Collection
              </button>
            </div>
          </section> */}
          <Banner
            image={spiceBanner}
            title={`Shop Spices`}
            subtitle={`Check out our spice shop for all your cooking needs.
               Find the perfect flavors to make your meals delicious.`}
            />
          <ErrorBoundary>
            <EnhancedSpiceList enableInfiniteScroll={true} />
          </ErrorBoundary>
        </>
      )}
      <ResponsiveFooter />
    </>
  );
}
