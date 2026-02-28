// features/recipes/recipesSlice.ts
import { Recipe } from '@/typings';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface RecipesState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  loading: false,
  error: null,
};

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async () => {
  const apiUrl = process.env.NEXT_PUBLIC_RECIPE_API_ROUTE;
  if (!apiUrl) {
    return [];
  }
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }
  const response = await res.json();
  console.log(`Reducer Recipes: ${response ? 'success' : 'failed'}`)
  return response;
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch recipes';
      });
  },
});

export default recipesSlice.reducer;
