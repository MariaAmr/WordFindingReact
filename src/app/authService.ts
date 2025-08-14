import axios from "axios";
import { store } from "./store";
import loginSuccess, {  logout } from "../features/auth/authSlice";
import { delay } from "./utils";

const API_URL = "http://localhost:5173/";

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock user database with localStorage persistence
const getMockUsers = () => {
  const users = localStorage.getItem("mockUsers");
  return users
    ? JSON.parse(users)
    : [
        { username: "admin", email: "admin@example.com", password: "admin123" },
        {
          username: "user1",
          email: "user1@example.com",
          password: "password1",
        },
      ];
};

const saveMockUsers = (users: any[]) => {
  localStorage.setItem("mockUsers", JSON.stringify(users));
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { token } = await refreshToken();
        store.dispatch(
          loginSuccess({
            username: localStorage.getItem("username") || "",
            token,
          })
        );
        localStorage.setItem("authToken", token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  await delay(300);

  const users = getMockUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) throw new Error("Invalid username or password");

  const token = "mock-jwt-token-" + Math.random().toString(36).substring(2);

  // Store auth data
  localStorage.setItem("authToken", token);
  localStorage.setItem("username", username);

  return {
    token,
    user: { username: user.username, email: user.email },
  };
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  await delay(300);

  const users = getMockUsers();
  if (users.some((u) => u.username === username)) {
    throw new Error("Username already exists");
  }

  const newUser = { username, email, password };
  saveMockUsers([...users, newUser]);

  // Return mock token to simulate immediate login
  const token = "mock-jwt-token-" + Math.random().toString(36).substring(2);

  return {
    token,
    user: { username, email },
    message: "Registration successful",
  };
};

export const refreshToken = async () => {
  await delay(300);
  return {
    token: "mock-refreshed-token-" + Math.random().toString(36).substring(2),
  };
};

export const validateToken = async () => {
  await delay(150); // Very fast validation for mock
  return { isValid: !!localStorage.getItem("authToken") };
};

export default api;
