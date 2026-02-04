import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../css/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Sign up user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
            phone: formData.phone,
          },
        },
      });

      if (signUpError) {
        setError(
          signUpError.message || "Registration failed. Please try again.",
        );
        setLoading(false);
        return;
      }

      if (data?.user) {
        // If you want to store additional data in a profiles table:
        // Uncomment the code below and ensure your profiles table exists
        /*
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: formData.fullName,
              username: formData.username,
              phone: formData.phone,
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
        */

        setSuccess(
          "Registration successful! Please check your email to confirm your account.",
        );

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        <h1 className="auth-title">Create Account</h1>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <div className="floating-label">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="line-input"
                disabled={loading}
              />
              <label htmlFor="fullName" className={formData.fullName ? 'focused' : ''}>Full Name</label>
            </div>
          </div>

          <div className="form-group">
            <div className="floating-label">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="line-input"
                disabled={loading}
              />
              <label htmlFor="username" className={formData.username ? 'focused' : ''}>Username</label>
            </div>
          </div>

          <div className="form-group">
            <div className="floating-label">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="line-input"
                disabled={loading}
              />
              <label htmlFor="phone" className={formData.phone ? 'focused' : ''}>Phone Number (Optional)</label>
            </div>
          </div>

          <div className="form-group">
            <div className="floating-label">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="line-input"
                disabled={loading}
              />
              <label htmlFor="email" className={formData.email ? 'focused' : ''}>Email</label>
            </div>
          </div>

          <div className="form-group">
            <div className="floating-label">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="line-input"
                disabled={loading}
              />
              <label htmlFor="password" className={formData.password ? 'focused' : ''}>Password</label>
            </div>
          </div>

          <div className="form-group">
            <div className="floating-label">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="line-input"
                disabled={loading}
              />
              <label htmlFor="confirmPassword" className={formData.confirmPassword ? 'focused' : ''}>Confirm Password</label>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
