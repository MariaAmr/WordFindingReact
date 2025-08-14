import axios from "axios";

const API_URL = "http://localhost:5173/api/auth"; // Replace with your backend URL

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  // Mock response - remove this when you have a real backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          username: userData.username,
          email: userData.email
        },
        token: 'mock-jwt-token'
      });
    }, 1000);
  });
};
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // { user, token }
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// Set auth token in axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
