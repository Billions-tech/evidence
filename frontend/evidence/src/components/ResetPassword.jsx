// src/components/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";
import { showError, showSuccess } from "./SweetAlert";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMsg("Invalid or missing token.");
      return;
    }
    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await resetPassword(token, newPassword);
      showSuccess("Password reset successful!");
      setMsg("Password reset! You can now login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showError(err.response?.data?.error || "Reset failed");
      setMsg(err.response?.data?.error || "Reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-3">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-indigo-700">
        <h2 className="text-2xl font-extrabold mb-6 text-center tracking-wider text-indigo-200">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {msg && <div className="mt-2 text-indigo-200 text-center">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
