// features/news/newsSlice.ts
import { BlogPost } from '@/typings';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface NewsState {
  news: BlogPost[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
};

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
  const apiUrl = process.env.NEXT_PUBLIC_BLOG_API_ROUTE;
  if (!apiUrl) {
    return [];
  }
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }
  const response = await res.json();
  console.log(`Reducer news: ${response}}`)
  return response;
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<BlogPost[]>) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch news';
      });
  },
});

export default newsSlice.reducer;
