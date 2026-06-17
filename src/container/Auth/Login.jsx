import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { loginUser } from "../../../api";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);

      console.log("Login Response:", response.data);

      const token =
        response?.data?.token ||
        response?.data?.access_token ||
        response?.data?.data?.token;

      const user =
        response?.data?.user ||
        response?.data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Dispatch authChanged event to notify navbar
      window.dispatchEvent(new Event("authChanged"));

      alert(
        response?.data?.message || "Login successful"
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">
            Cred<span className="text-blue-200">Root</span>
          </h1>

          <h2 className="text-3xl font-semibold mb-4">
            Welcome Back
          </h2>

          <p className="text-blue-100 text-lg">
            Login to manage your credit products and
            financial services.
          </p>

          <img
            src="https://illustrations.popsy.co/blue/sign-in.svg"
            alt="login"
            className="mt-10 max-w-sm"
          />
        </div>

        {/* Right Side */}
        <div className="p-10 md:p-14 bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full border-2 border-gray-300 bg-white text-black rounded-xl pl-12 pr-4 py-3 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full border-2 border-gray-300 bg-white text-black rounded-xl pl-12 pr-4 py-3 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign Up
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;