import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  token: localStorage.getItem("authToken") || null,
  username: localStorage.getItem("username") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login reducers
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.loading = false;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("username", action.payload.username);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Registration reducers
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.loading = false;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("username", action.payload.username);
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout reducer
    logout(state) {
      state.token = null;
      state.username = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
