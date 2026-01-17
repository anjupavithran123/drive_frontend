import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register({ email, password, name });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (e) {
      alert(e.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">

      {/* 🔙 Back Button (Top Left) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
      >
        ← Back
      </button>

      {/* Register Card */}
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl bg-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl bg-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 rounded-xl bg-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow-lg"
        >
          Register
        </button>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 hover:underline cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
