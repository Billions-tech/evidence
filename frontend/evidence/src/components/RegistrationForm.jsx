// src/components/RegistrationForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { showError, showSuccess } from "./SweetAlert";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBuilding,
  FaImage,
  FaQuoteRight,
  FaRegCommentDots,
} from "react-icons/fa";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    businessName: "",
    logo: "",
    slogan: "",
    defaultFooterMsg: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0].name : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await register(form);
      login(res.data.token, res.data.user);
      showSuccess("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      showError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-indigo-700">
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wider text-indigo-200">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaUser className="mr-3 text-indigo-300 text-xl" />
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-indigo-300"
              required
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaEnvelope className="mr-3 text-purple-300 text-xl" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-purple-300"
              required
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaLock className="mr-3 text-pink-300 text-xl" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-pink-300"
              required
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaPhone className="mr-3 text-green-300 text-xl" />
            <input
              name="phoneNumber"
              type="text"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-green-300"
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaBuilding className="mr-3 text-yellow-300 text-xl" />
            <input
              name="businessName"
              type="text"
              placeholder="Business Name"
              value={form.businessName}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-yellow-300"
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaImage className="mr-3 text-red-300 text-xl" />
            <input
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-red-300"
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaQuoteRight className="mr-3 text-indigo-200 text-xl" />
            <input
              name="slogan"
              type="text"
              placeholder="Slogan"
              value={form.slogan}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-indigo-200"
            />
          </div>
          <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
            <FaRegCommentDots className="mr-3 text-indigo-400 text-xl" />
            <input
              name="defaultFooterMsg"
              type="text"
              placeholder="Default Footer Message"
              value={form.defaultFooterMsg}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && (
            <div className="text-red-400 mt-2 text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
