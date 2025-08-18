import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DatamuseSearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";
import { useEffect } from "react";
import { loginSuccess } from "./app/authSlice";
import {  useAppDispatch } from "./app/store";

function App() {
  if (!localStorage.getItem("mockUsers")) {
    localStorage.setItem(
      "mockUsers",
      JSON.stringify([
        { username: "admin", password: "admin123" },
        { username: "user1", password: "password1" },
      ])
    );
  }
  const dispatch = useAppDispatch();
  
useEffect(() => {
  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  if (token && username) {
    dispatch(loginSuccess({ token, username }));
  }
}, [dispatch]);
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
