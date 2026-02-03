import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute Component
// Wraps routes that require authentication
// - If authenticated: renders the component
// - If not authenticated: redirects to /login
// - While checking: shows loading state

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={loadingStyles}>
        <div style={spinnerStyles}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// Simple loading spinner styles
const loadingStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
};

const spinnerStyles = {
  width: "50px",
  height: "50px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #667eea",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Add animation keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default ProtectedRoute;
