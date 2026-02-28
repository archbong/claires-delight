import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ReviewItem {
  id: string;
  name: string;
  description: string;
  rating?: number | null;
}

interface ReviewsState {
  reviews: ReviewItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async () => {
  const res = await fetch("/api/customer-reviews");
  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }
  return (await res.json()) as ReviewItem[];
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<ReviewItem[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      });
  },
});

export default reviewsSlice.reducer;
