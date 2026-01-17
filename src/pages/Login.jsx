import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (e) {
      alert(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
      
      {/* 🔙 Back Button (Top Right) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
      >
        ← Back
      </button>

      {/* Login Card */}
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow-lg"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/20"></div>
          <span className="px-4 text-sm text-gray-400">OR</span>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-500 hover:underline cursor-pointer font-medium"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
