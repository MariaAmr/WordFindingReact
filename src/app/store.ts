// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import authReducer from "../features/auth/authSlice";
import datamuseReducer from "../features/api/datamuseApiSlice";

const preloadedState = {
  auth: {
    token: localStorage.getItem("authToken") || null,
    username: localStorage.getItem("username") || null,
    loading: false,
    error: null,
  },
  // Add other preloaded states if needed
  // datamuse: {...}
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    datamuse: datamuseReducer,
  },
  preloadedState, // Add this line to initialize with localStorage values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.timestamp"],
        ignoredPaths: ["datamuse.history"],
      },
    }),
});
// Type definitions for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Pre-typed versions of useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
