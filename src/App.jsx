// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <AuthProvider>
    <Routes>
      {/* Default route - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={["sales", "admin"]}>
            <SalesDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
