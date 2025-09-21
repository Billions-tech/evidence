// src/components/LoginForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { showError, showSuccess } from "./SweetAlert";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginApi(form);
      // Try to fetch user with token
      try {
        await login(res.data.token, res.data.user);
        showSuccess("Login successful!");
        navigate("/dashboard");
      } catch {
        setError("Authentication failed. Please try again.");
        showError("Authentication failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      showError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-3 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-indigo-700">
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wider text-indigo-200">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 mb-4">
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaEnvelope className="mr-3 text-indigo-300 text-xl" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent text-white outline-none placeholder-indigo-300"
              required
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaLock className="mr-3 text-purple-300 text-xl" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-purple-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center mb-4 justify-center transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-red-400 mt-2 text-center">{error}</div>
          )}
        </form>

        <div className=" my-4 font-bold tracking-wider text-center w-full text-indigo-200 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-yellow-400 underline font-semibold"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
