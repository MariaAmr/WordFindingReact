import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DatamuseSearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <Router basename={import.meta.env.BASE_URL || "/"}>
      <Routes>
        {/* Redirect root path to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="datamuse-search" replace />} />
            <Route path="datamuse-search" element={<DatamuseSearchPage />} />
            <Route path="datamuse-history" element={<HistoryPage />} />

            {/* Handle nested 404s within dashboard */}
            <Route
              path="*"
              element={<Navigate to="datamuse-search" replace />}
            />
          </Route>
        </Route>

        {/* Global 404 fallback */}
        <Route
          path="*"
          element={<Navigate to="/login" state={{ from: location }} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
