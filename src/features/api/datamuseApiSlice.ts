// features/api/datamuseApiSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

interface WordResult {
  word: string;
  score: number;
  tags?: string[];
}

interface ApiRequest {
  id: string;
  url: string;
  status: "pending" | "fulfilled" | "rejected";
  timestamp: number;
  response?: WordResult[];
  error?: string;
  username: string;
  searchType: string;
  searchTerm: string;
}

interface DatamuseState {
  results: WordResult[];
  history: ApiRequest[];
  loading: boolean;
  error: string | null;
  requestCount: number;
  suggestions: WordResult[];
}

const initialState: DatamuseState = {
  results: [],
  history: [],
  loading: false,
  error: null,
  requestCount: 0,
  suggestions: [],
};

export const fetchSuggestions = createAsyncThunk(
  "datamuse/fetchSuggestions",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.datamuse.com/sug", {
        params: { s: query },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Suggestion fetch failed");
    }
  }
);

export const searchWords = createAsyncThunk(
  "datamuse/searchWords",
  async (params: Record<string, string>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const username = state.auth.username || "anonymous";

      const response = await axios.get("https://api.datamuse.com/words", {
        params,
      });

      return { data: response.data, username, searchParams: params };
    } catch (err) {
      return rejectWithValue(err.response?.data || "An error occurred");
    }
  }
);

const datamuseSlice = createSlice({
  name: "datamuse",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.history = [];
      state.requestCount = 0;
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(
        (item) => item.id !== action.payload
      );
    },
    setResultsFromHistory: (state, action: PayloadAction<WordResult[]>) => {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchWords.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestCount += 1;

        const stateRoot = action.meta.arg as unknown as RootState;
        const username = stateRoot?.auth?.username || "unknown";

        const searchType = Object.keys(action.meta.arg)[0];
        const searchTerm = action.meta.arg[searchType];

        state.history.unshift({
          id: Date.now().toString(),
          url: `https://api.datamuse.com/words?${new URLSearchParams(
            action.meta.arg
          ).toString()}`,
          status: "pending",
          timestamp: Date.now(),
          username: username,
          searchType,
          searchTerm,
          response: undefined,
        });
      })
      .addCase(searchWords.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;

        // Find the most recent pending request and update it
        const pendingIndex = state.history.findIndex(
          (req) => req.status === "pending"
        );

        if (pendingIndex !== -1) {
          const searchType = Object.keys(action.payload.searchParams)[0];
          const searchTerm = action.payload.searchParams[searchType];

          state.history[pendingIndex].status = "fulfilled";
          state.history[pendingIndex].response = action.payload.data;
          state.history[pendingIndex].username = action.payload.username;
          state.history[pendingIndex].searchType = searchType;
          state.history[pendingIndex].searchTerm = searchTerm;
        }
      })
      .addCase(searchWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        // Find the most recent pending request and mark it as rejected
        const pendingIndex = state.history.findIndex(
          (req) => req.status === "pending"
        );

        if (pendingIndex !== -1) {
          state.history[pendingIndex].status = "rejected";
          state.history[pendingIndex].error = action.payload as string;
        }
      })
      .addCase(fetchSuggestions.pending, (state) => {
        state.suggestions = [];
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearHistory, removeFromHistory } = datamuseSlice.actions;
export default datamuseSlice.reducer;
