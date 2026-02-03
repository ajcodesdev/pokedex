import React from "react";
import { useAuth } from "../context/AuthContext";

// Example Logout Button Component
const LogoutButton = () => {
  const { logout, loading } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Navigation happens automatically when user state changes
    } catch (error) {
      console.error("Failed to logout:", error);
      setLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading || loggingOut}
      style={buttonStyles}
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );
};

const buttonStyles = {
  padding: "10px 20px",
  backgroundColor: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default LogoutButton;
