// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";
// import type { RootState } from "./app/store";

// const ProtectedRoute = () => {
//   const { token } = useSelector((state: RootState) => state.auth);
//   const localStorageToken = localStorage.getItem("authToken");

//   // Allow access if either Redux or localStorage has a token
//   const isAuthenticated = token || localStorageToken;

//   console.log("ProtectedRoute - Redux token:", token);
//   console.log("ProtectedRoute - localStorage token:", localStorageToken);

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "./app/store";

const ProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    // Check both Redux and localStorage
    const localStorageToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!token || !!localStorageToken);
  }, [token]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;