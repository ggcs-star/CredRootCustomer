import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";

import { registerUser, verifyOtp } from "../../../api";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(formData);

      console.log("Register Response:", response.data);

      alert(
        response?.data?.message ||
        "OTP sent successfully."
      );

      setRegisteredEmail(formData.email);
      setShowOtpModal(true);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOtp({
        email: registeredEmail,
        otp,
      });

      console.log("OTP Verify Response:", response.data);

      alert(
        response?.data?.message ||
        "OTP verified successfully"
      );

      setShowOtpModal(false);

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

          {/* Left Side */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-4">
              Cred<span className="text-blue-200">Root</span>
            </h1>

            <h2 className="text-3xl font-semibold mb-4">
              Create Your Account
            </h2>

            <p className="text-blue-100 text-lg">
              Register and explore a smarter way to access loans,
              credit cards, and financial products.
            </p>

            <img
              src="https://illustrations.popsy.co/blue/work-from-home.svg"
              alt="signup"
              className="mt-10 w-full max-w-sm"
            />
          </div>

          {/* Right Side */}
          <div className="p-8 md:p-14">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

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
                    placeholder="Enter your email address"
                    required
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    required
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
              Verify OTP
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Enter the OTP sent to
              <span className="block font-semibold text-blue-600 mt-1">
                {registeredEmail}
              </span>
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900 placeholder-gray-400 bg-white outline-none focus:border-blue-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Signup;