// features/api/datamuseApiSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
}

interface DatamuseState {
  results: WordResult[];
  history: ApiRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: DatamuseState = {
  results: [],
  history: [],
  loading: false,
  error: null,
};

export const searchWords = createAsyncThunk(
  "datamuse/searchWords",
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.datamuse.com/words", {
        params,
      });
      return response.data;
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchWords.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.history.unshift({
          id: Date.now().toString(),
          url: `https://api.datamuse.com/words?${new URLSearchParams(
            action.meta.arg
          ).toString()}`,
          status: "pending",
          timestamp: Date.now(),
        });
      })
      .addCase(searchWords.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        const pendingRequest = state.history.find(
          (req) => req.status === "pending"
        );
        if (pendingRequest) {
          pendingRequest.status = "fulfilled";
          pendingRequest.response = action.payload;
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
