// features/blogs/blogsSlice.ts
import { BlogPost } from '@/typings';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface BlogsState {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogsState = {
  blogs: [],
  loading: false,
  error: null,
};

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const apiUrl = process.env.NEXT_PUBLIC_BLOG_API_ROUTE;
  if (!apiUrl) {
    return [];
  }
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  const response = await res.json();
  console.log(`Reducer blogs: ${response}}`)
  return response;
});

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<BlogPost[]>) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch blogs';
      });
  },
});

export default blogsSlice.reducer;
