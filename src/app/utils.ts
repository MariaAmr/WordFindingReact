
// utils.ts
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const saveAuthData = (token: string, username: string) => {
  localStorage.setItem("authToken", token);  // Changed from "token"
  localStorage.setItem("username", username);
};

export const clearAuthData = () => {
  localStorage.removeItem("authToken");  // Changed from "token"
  localStorage.removeItem("username");
};

export const getAuthData = () => ({
  token: localStorage.getItem("authToken"),  // Changed from "token"
  username: localStorage.getItem("username"),
});

// export const initializeAuthState = (store: any) => {
//   // Initial sync on load
//   const { token, username } = getAuthData();
//   if (token && username) {
//     store.dispatch(loginSuccess({ token, username }));
//   }

//   // Storage event listener
//   const handleStorageChange = (e: StorageEvent) => {
//     if (e.key === 'authToken' || e.key === 'username') {
//       const { token, username } = getAuthData();
      
//       if (token && username) {
//         store.dispatch(loginSuccess({ token, username }));
//       } else {
//         store.dispatch(logout());
//       }
//     }
//   };

//   window.addEventListener('storage', handleStorageChange);
//   return () => window.removeEventListener('storage', handleStorageChange);
// };