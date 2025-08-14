// utils.ts
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const saveAuthData = (token: string, username: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

export const getAuthData = () => ({
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
});
