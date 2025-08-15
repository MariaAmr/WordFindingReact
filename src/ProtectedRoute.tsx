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
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import type { RootState } from "./app/store";

const ProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const localStorageToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  console.log("ProtectedRoute - Redux token:", token);
  console.log("ProtectedRoute - localStorage token:", localStorageToken);

  // Synchronization effect
  useEffect(() => {
    if (localStorageToken && !token) {
      console.log("Token mismatch detected - forcing refresh");
      window.location.reload();
    }
  }, [token, localStorageToken]);
  const isAuthenticated = token || localStorageToken;

  if (!isAuthenticated) {
    console.log("Not authenticated - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;