// // AuthProvider.tsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { getAuthData } from "./app/utils";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check localStorage on initial load
//     const { token, username } = getAuthData();
//     if (token && username) {
//       setUser({ username });
//     }
//   }, []);

//   const login = (username, token) => {
//     setUser({ username });
//     localStorage.setItem("token", token);
//     localStorage.setItem("username", username);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
