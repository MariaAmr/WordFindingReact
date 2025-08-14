import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "./app/store";

const ProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const localStorageToken = localStorage.getItem("authToken");

  // Allow access if either Redux or localStorage has a token
  const isAuthenticated = token || localStorageToken;

  console.log("ProtectedRoute - Redux token:", token);
  console.log("ProtectedRoute - localStorage token:", localStorageToken);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;