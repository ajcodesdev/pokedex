import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../css/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(
          error.message || "Login failed. Please check your credentials.",
        );
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Redirect to home/dashboard on successful login
        navigate("/home");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="form">
        <div className="form-title"><span>sign in to your</span></div>
        <div className="title-2"><span>POKÉDEX</span></div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="input-container">
          <input 
            placeholder="Email" 
            type="email" 
            className="input-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          <span> </span>
        </div>

        <section className="bg-stars">
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
        </section>

        <div className="input-container">
          <input 
            placeholder="Password" 
            type="password" 
            className="input-pwd"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <button className="submit" type="submit" disabled={loading}>
          <span className="sign-text">{loading ? "Logging in..." : "Sign in"}</span>
        </button>

        <p className="signup-link">
          No account?
          <Link to="/register" className="up">Sign up!</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
