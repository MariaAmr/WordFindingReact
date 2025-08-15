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
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "./app/store";

const ProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const localStorageToken = localStorage.getItem("authToken");
  const location = useLocation();
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
    return null; // or return a loading spinner
  }

  const isAuthenticated = token || localStorageToken;

  if (!isAuthenticated) {
    console.log("Not authenticated - redirecting to login");
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // Preserve the location they came from
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;