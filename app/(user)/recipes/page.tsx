import Banner from "@/app/components/banner/Banner";
import { recipeBanner } from "@/public/image/cdn/cdn";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import RecipeList from "@/app/components/recipe/RecipeList";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import Navbar from "@/app/components/header/navbar/Navbar";
import { getRecipes } from "@/lib/data";

export default async function Page() {
  const recipes = await getRecipes();

  return (
    <>
      <Navbar />
      <>
        <Banner
          image={recipeBanner}
          title={`Recipes`}
          subtitle={`Find delicious recipes for every occasion with complete easy-to-follow
         instructions and helpful tips to elevate your home cooking experience`}
        />
        <ErrorBoundary>
          <RecipeList recipes={recipes} />
        </ErrorBoundary>
      </>
      <ResponsiveFooter />
    </>
  );
}
