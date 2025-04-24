import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.adminAuth || { isAuthenticated: false });
  const adminToken = localStorage.getItem("adminAccess");
  
  console.log("AdminProtectedRoute - Redux isAuthenticated:", isAuthenticated);
  console.log("AdminProtectedRoute - localStorage token:", adminToken ? "exists" : "not found");
  
  if (!isAuthenticated && !adminToken) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/admin-login" replace />;
  }
  
  console.log("Authentication confirmed, rendering protected content");
  return children;
};

export default AdminProtectedRoute;