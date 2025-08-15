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
import { Outlet } from "react-router-dom";
import type { RootState } from "./app/store";

const ProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const localStorageToken = localStorage.getItem("authToken");
  // const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Handle token synchronization
    if (localStorageToken && !token) {
      console.log("Token mismatch detected - forcing refresh");
      window.location.reload();
      return;
    }
    setIsCheckingAuth(false);
  }, [token, localStorageToken]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token && !localStorageToken) {
    // Use window.location for complete reset
    window.location.href = "/login";
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;