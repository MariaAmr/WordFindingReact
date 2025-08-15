// features/api/datamuseApiSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  
}

const initialState: DatamuseState = {
  results: [],
  history: [],
  loading: false,
  error: null,
  requestCount: 0,
};

export const searchWords = createAsyncThunk(
  "datamuse/searchWords",
  async (params: Record<string, string>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const username = state.auth.username || "anonymous";

      const response = await axios.get("https://api.datamuse.com/words", {
        params,
      });

      return { data: response.data, username }; // Return both data and username
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchWords.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestCount += 1;
        const username = "unknown";
        const searchType = Object.keys(action.meta.arg)[0];
        const searchTerm = action.meta.arg[searchType];

        // Remove the username or find another way to get it
        state.history.unshift({
          id: Date.now().toString(),
          url: `https://api.datamuse.com/words?${new URLSearchParams(
            action.meta.arg
          ).toString()}`,
          status: "pending",
          timestamp: Date.now(),
          username: "unknown", // Temporary placeholder
          searchType,
          searchTerm,
          response: undefined,
        });
      })
      .addCase(searchWords.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data; // Access the data property
        const pendingRequest = state.history.find(
          (req) => req.status === "pending"
        );
        if (pendingRequest) {
          pendingRequest.status = "fulfilled";
          pendingRequest.response = action.payload.data;
          pendingRequest.username = action.payload.username; // Set the username
        }
      })
    
      .addCase(searchWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const pendingRequest = state.history.find(
          (req) => req.status === "pending"
        );
        if (pendingRequest) {
          pendingRequest.status = "rejected";
          pendingRequest.error = action.payload as string;
        }
      });
  },
});

export const { clearHistory } = datamuseSlice.actions;
export default datamuseSlice.reducer;
