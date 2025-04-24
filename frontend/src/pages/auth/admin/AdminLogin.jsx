import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAdminToken } from "../../../redux/slices/auth/AdminAuthSlice";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";


const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(
    (state) => state.adminAuth || { isAuthenticated: false }
  );

  useEffect(() => {
    const adminToken = localStorage.getItem("adminAccess");
    if (isAuthenticated || adminToken) {
      navigate("/admin-dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post('/admin-panel/admin-login/', form);

      // Save tokens
      dispatch(setAdminToken(res.data.access));
      localStorage.setItem("adminAccess", res.data.access);
      localStorage.setItem("adminRefresh", res.data.refresh);

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Admin Login</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="username"
          placeholder="Admin Username"
          onChange={handleChange}
          style={{ padding: "8px" }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={{ padding: "8px" }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
