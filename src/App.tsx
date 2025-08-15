import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DatamuseSearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="datamuse-search" replace />} />
          <Route path="datamuse-search" element={<DatamuseSearchPage />} />
          <Route path="datamuse-history" element={<HistoryPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
