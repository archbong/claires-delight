"use client";

import BodyWrapper from "@/app/components/layout/BodyWrapper";
import Pagination from "@/app/components/pagination/Pagination";
import RecipeCard from "@/app/components/recipe/RecipeCard";
import { Recipe } from "@/typings";
import { Suspense, useMemo, useState } from "react";
import Unavailable from "../Unavailable";

const ITEMS_PER_PAGE = 10;

interface RecipeListProps {
  recipes?: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(recipes.length / ITEMS_PER_PAGE)),
    [recipes.length]
  );

  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return recipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [recipes, currentPage]);


if (!recipes.length) {
  return (
  <Unavailable itemType="recipes" />
  );
}

  return (
    <BodyWrapper>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 xl:grid-cols-2">
          {paginatedRecipes.map((recipe: Recipe) => (
            <Suspense key={recipe._id}>
              <RecipeCard recipe={recipe} />
            </Suspense>
          ))}
        </div>
      </div>

      <div className="pt-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
          onPreviousPage={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
        />
      </div>
    </BodyWrapper>
  );
};

export default RecipeList;
