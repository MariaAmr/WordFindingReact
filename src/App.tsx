import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DatamuseSearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="datamuse-search" element={<DatamuseSearchPage />} />
            <Route path="datamuse-history" element={<HistoryPage/>} />
            <Route index element={<Navigate to="datamuse-search" replace />} />
          </Route>
        </Route>

        {/* Fallback route for 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
