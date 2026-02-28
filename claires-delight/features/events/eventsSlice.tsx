import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UpcomingEvent } from '@/typings';

interface EventState {
  events: UpcomingEvent[];
  loading: boolean;
  error: string | null;
  reminders: { [key: string]: boolean };
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
  reminders: {},
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const apiUrl = process.env.NEXT_PUBLIC_EVENTS_API_ROUTE;
  if (!apiUrl) {
    return [];
  }
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  return await res.json();
});

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setReminders: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.reminders = action.payload;
    },
    toggleReminder: (state, action: PayloadAction<string>) => {
      state.reminders[action.payload] = !state.reminders[action.payload];
      localStorage.setItem("reminders", JSON.stringify(state.reminders));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<UpcomingEvent[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch events';
      });
  },
});

export const { setReminders, toggleReminder } = eventSlice.actions;
export default eventSlice.reducer;
