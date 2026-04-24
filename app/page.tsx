"use client";

import EnhancedNavbar from "./components/header/navbar/EnhancedNavbar";
import ResponsiveFooter from "./components/footer/responsive/ResponsiveFooter";
import Hero from "./components/LandingPage/Hero";
import Choose from "./components/LandingPage/Choose";
import CulinaryInspiration from "./components/LandingPage/CulinaryInspirations";
import CustomerReview from "./components/LandingPage/CustomerReview";
import RecipeVisuals from "./components/LandingPage/RecipeVisuals";
import Ourservice from "./components/LandingPage/OurService";
import Spice from "./components/LandingPage/Spice";

export default function Home() {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search functionality here
  };

  const handleClearStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedNavbar onSearch={handleSearch} />
      <main className="flex-1">
        <Hero />
        <Choose />
        <Spice />
        <CulinaryInspiration />
        <Ourservice />
        <CustomerReview />
        <RecipeVisuals />
      </main>
      <ResponsiveFooter />
    </div>
  );
}
