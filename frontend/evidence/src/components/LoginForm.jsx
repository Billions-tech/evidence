// src/components/LoginForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { requestPasswordReset } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { showError, showSuccess } from "./SweetAlert";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
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

        <div className="my-4 font-bold tracking-wider text-center w-full text-indigo-200 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-yellow-400 underline font-semibold"
          >
            Register
          </a>
        </div>
        <div className="my-2 text-center">
          <button
            type="button"
            className="text-indigo-300 underline text-sm font-semibold"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </button>
        </div>
        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md relative border border-indigo-700">
              <button
                className="absolute top-2 right-3 text-indigo-200 text-xl font-bold hover:text-white"
                onClick={() => setShowForgot(false)}
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-indigo-200 text-center">
                Reset Password
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotLoading(true);
                  setForgotMsg("");
                  try {
                    await requestPasswordReset(forgotEmail);
                    setForgotMsg(
                      "If your email exists, a reset link will be sent."
                    );
                  } catch (err) {
                    console.error(err);
                    setForgotMsg("Failed to send reset email.");
                  }
                  setForgotLoading(false);
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
                {forgotMsg && (
                  <div className="mt-2 text-indigo-200 text-center">
                    {forgotMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
