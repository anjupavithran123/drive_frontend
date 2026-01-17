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

      // store JWT
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (e) {
      alert(e.response?.data?.message || "Login failed");
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
