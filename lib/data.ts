import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type ProductCategory = {
  title: string;
  slug: string;
  stock: number;
};

type ProductHealthBenefit = {
  benefit: string;
};

type ProductCulinaryUse = {
  use: string;
};

type ProductImage = {
  url: string;
};

type ProductReview = {
  rating: number | null;
};

type ProductWithRelations = {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  price: number;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: ProductCategory[];
  healthBenefits: ProductHealthBenefit[];
  culinaryUses: ProductCulinaryUse[];
  images: ProductImage[];
  reviews: ProductReview[];
};

type RecipeIngredient = {
  name: string;
};

type RecipeMethodStep = {
  step: string;
  order: number;
};

type RecipeWithRelations = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  difficulty: string;
  servings: number;
  cookingTime: number;
  ingredients: RecipeIngredient[];
  methodSteps: RecipeMethodStep[];
};

type RecipeBase = Omit<RecipeWithRelations, "ingredients" | "methodSteps">;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

const mapProduct = (product: ProductWithRelations) => {
  const ratings = (product.reviews ?? [])
    .map((review) => review.rating)
    .filter((rating: number | null) => typeof rating === "number") as number[];
  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
      : undefined;

  return {
    _id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: (product.categories ?? []).map((category) => ({
      title: category.title,
      slug: category.slug,
      stock: category.stock,
    })),
    origin: product.origin,
    healthBenefit: (product.healthBenefits ?? []).map((item) => item.benefit),
    culinaryUses: (product.culinaryUses ?? []).map((item) => item.use),
    price: product.price,
    stock: product.stock,
    images: product.images?.[0]?.url ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    isNew: product.featured,
    rating: averageRating,
    reviewCount: (product.reviews ?? []).length,
  };
};

const mapRecipe = (recipe: RecipeWithRelations) => ({
  _id: recipe.id,
  title: recipe.title,
  slug: recipe.slug,
  description: recipe.description,
  image: recipe.image,
  ingredients: (recipe.ingredients ?? []).map((item) => item.name),
  method: [...(recipe.methodSteps ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((item) => item.step),
  instructions: [...(recipe.methodSteps ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((item) => item.step),
  difficulty: (recipe.difficulty?.toLowerCase?.() as "easy" | "medium" | "hard" | undefined),
  servings: recipe.servings,
  cookTime: recipe.cookingTime,
});

console.log("Data mapping functions defined successfully.");

const hydrateRecipeRelations = async (recipes: RecipeBase[]): Promise<RecipeWithRelations[]> => {
  if (!recipes.length) {
    return [];
  }

  const recipeIds = recipes.map((recipe) => recipe.id);

  const [ingredients, methodSteps] = await Promise.all([
    prisma.recipeIngredient.findMany({
      where: { recipeId: { in: recipeIds } },
    }),
    prisma.recipeMethodStep.findMany({
      where: { recipeId: { in: recipeIds } },
      orderBy: { order: "asc" },
    }),
  ]);

  const ingredientsByRecipe = new Map<string, RecipeIngredient[]>();
  const stepsByRecipe = new Map<string, RecipeMethodStep[]>();

  for (const ingredient of ingredients) {
    const list = ingredientsByRecipe.get(ingredient.recipeId) ?? [];
    list.push({ name: ingredient.name });
    ingredientsByRecipe.set(ingredient.recipeId, list);
  }

  for (const step of methodSteps) {
    const list = stepsByRecipe.get(step.recipeId) ?? [];
    list.push({ step: step.step, order: step.order });
    stepsByRecipe.set(step.recipeId, list);
  }

  return recipes.map((recipe) => ({
    ...recipe,
    ingredients: ingredientsByRecipe.get(recipe.id) ?? [],
    methodSteps: stepsByRecipe.get(recipe.id) ?? [],
  }));
};

export const getProduct = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        healthBenefits: true,
        culinaryUses: true,
        images: true,
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" as const },
    });

    return products.map((product) => mapProduct(product as ProductWithRelations));
  } catch (error: unknown) {
    console.error(`Error getting product data: ${getErrorMessage(error)}`);
    return [];
  }
};

export const getSpice = async (slug: string) => {
  try {
    const spice =
      (await prisma.product.findUnique({
        where: { slug },
        include: {
          categories: true,
          healthBenefits: true,
          culinaryUses: true,
          images: true,
          reviews: {
            select: { rating: true },
          },
        },
      })) ??
      (await prisma.product.findUnique({
        where: { id: slug },
        include: {
          categories: true,
          healthBenefits: true,
          culinaryUses: true,
          images: true,
          reviews: {
            select: { rating: true },
          },
        },
      }));

    return spice ? mapProduct(spice as ProductWithRelations) : null;
  } catch (error: unknown) {
    console.error("Failed to fetch spice data:", getErrorMessage(error));
    return null;
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        tags: true,
        category: true,
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" as const },
    });
    return posts;
  } catch (error: unknown) {
    console.log(`getPosts() could not get blog data: ${getErrorMessage(error)}`);
    return [];
  }
};

export const getRecipes = async () => {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "asc" as const },
  });
  const hydrated = await hydrateRecipeRelations(recipes as RecipeBase[]);
  return hydrated.map((recipe) => mapRecipe(recipe));
};

export const getRecipe = async (slug: string) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!recipe) {
      return null;
    }

    const [hydrated] = await hydrateRecipeRelations([recipe as RecipeBase]);
    return hydrated ? mapRecipe(hydrated) : null;
  } catch (error: unknown) {
    console.error(`Error getting single recipe: ${getErrorMessage(error)}`);
    return null;
  }
};

export const paymentFormPost = async (orderData: FormData) => {
  try {
    const dataObj: Record<string, FormDataEntryValue> = {};
    orderData.forEach((value, key) => {
      dataObj[key] = value;
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_ORDER_API_ROUTE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Network response was not ok");
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Error saving order:", getErrorMessage(error));
    throw error;
  }
};

export const getCustomerReview = async () => {
  try {
    return await prisma.customerReview.findMany({
      orderBy: { createdAt: "desc" as const },
    });
  } catch (error: unknown) {
    console.log(`Error getting customer reviews: ${getErrorMessage(error)}`);
    throw new Error("Failed to fetch customer reviews");
  }
};

export const getPost = async (slug: string) => {
  try {
    const postBySlug = await prisma.post.findUnique({
      where: { slug },
      include: {
        tags: true,
        category: true,
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (postBySlug) {
      return postBySlug;
    }

    return await prisma.post.findUnique({
      where: { id: slug },
      include: {
        tags: true,
        category: true,
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  } catch (error: unknown) {
    console.log(`Error getting single post: ${getErrorMessage(error)}`);
    return null;
  }
};

export const getUsers = async () => {
  try {
    return await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: { createdAt: "desc" as const },
    });
  } catch (error: unknown) {
    console.log(`Error getting users: ${getErrorMessage(error)}`);
    throw new Error("Failed to fetch users");
  }
};

export const getUser = async (id: string) => {
  noStore();
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  } catch (error: unknown) {
    console.log(`Error getting single user: ${getErrorMessage(error)}`);
    throw new Error("Failed to get single user");
  }
};

export const getUserByEmail = async (email: string) => {
  noStore();
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  } catch (error: unknown) {
    console.log(`Error getting single user by email: ${getErrorMessage(error)}`);
    throw new Error("Failed to get single user by email");
  }
};

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value ?? "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { id?: string };
    return decodedToken.id;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOGOUT_API_ROUTE}`);
    if (!res.ok) {
      throw new Error("Error calling logout endpoint.");
    }
    return await res.json();
  } catch (error: unknown) {
    console.log(`Error during logout: ${getErrorMessage(error)}`);
    return null;
  }
};

export const getEvents = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_EVENTS_API_ROUTE;
    if (!apiUrl) {
      throw new Error("Events API route is not defined in environment variables");
    }

    const res = await fetch(apiUrl, { next: { revalidate: 30 } });
    if (!res.ok) {
      throw new Error(`Error fetching events: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error(`Error getting event data: ${getErrorMessage(error)}`);
    return [];
  }
};
