import BodyWrapper from "@/app/components/layout/BodyWrapper";
import Link from "next/link";
import { getRecipe } from "@/lib/data";
import Navbar from "@/app/components/header/navbar/Navbar";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import RecipeDetail from "@/app/components/recipe/RecipeDetail";
import Breadcrumb from "@/app/components/Breadcrumb";

type RecipePageParams = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: RecipePageParams) => {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  return {
    title: recipe?.title ?? "Recipe",
    description: recipe?.description,
  };
};

export default async function Page({ params }: RecipePageParams) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    return (
      <>
        <Navbar />
        <BodyWrapper>
          <p className="py-10 text-center">Recipe not found.</p>
        </BodyWrapper>
        <ResponsiveFooter />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <BodyWrapper>
        <Breadcrumb
          items={[
            { label: "Recipes", href: "/recipes" },
            { label: "All Recipes", href: "/recipes" },
            { label: "Authentic Chicken Biryani" },
          ]}
        />
        <RecipeDetail item={recipe} />
      </BodyWrapper>
      <ResponsiveFooter />
    </>
  );
}
