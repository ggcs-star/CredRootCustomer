import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { registerUser, verifyOtp } from "../../../api";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
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
      toast.error("Passwords do not match");
      return;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(formData);

      console.log("Register Response:", response.data);

      toast.success(
        response?.data?.message ||
        "OTP sent successfully. Please verify your email."
      );

      setRegisteredEmail(formData.email);
      setShowOtpModal(true);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOtp({
        email: registeredEmail,
        otp,
      });

      console.log("OTP Verify Response:", response.data);

      toast.success(
        response?.data?.message ||
        "OTP verified successfully"
      );

      setShowOtpModal(false);
      setOtp("");

      // Navigate to login after successful verification
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Invalid OTP. Please try again."
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 transform transition-all duration-500 hover:shadow-3xl">

          {/* Left Side - Enhanced */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4">
                Cred<span className="text-blue-200">Root</span>
              </h1>

              <h2 className="text-3xl font-semibold mb-4">
                Create Your Account
              </h2>

              <p className="text-blue-100 text-lg leading-relaxed">
                Register and explore a smarter way to access loans,
                credit cards, and financial products.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Secure & Fast Registration</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Instant OTP Verification</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Access to Multiple Financial Products</span>
                </div>
              </div>

              <img
                src="https://illustrations.popsy.co/blue/work-from-home.svg"
                alt="signup"
                className="mt-10 w-full max-w-sm mx-auto"
              />
            </div>
          </div>

          {/* Right Side - Enhanced */}
          <div className="p-8 md:p-14 bg-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-500 mt-2">Join us and start your financial journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Mobile Number
                </label>

                <div className="relative group">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    required
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-4 py-3 text-gray-800 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password with Eye Icon */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Password
                </label>

                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 8 characters)"
                    required
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-12 py-3 text-gray-800 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    disabled={showOtpModal}
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {formData.password && !showOtpModal && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            formData.password.length < 4 ? 'w-1/3 bg-red-500' :
                            formData.password.length < 8 ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        formData.password.length < 4 ? 'text-red-500' :
                        formData.password.length < 8 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {formData.password.length < 4 ? 'Weak' :
                         formData.password.length < 8 ? 'Medium' :
                         'Strong'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.password.length < 8 ? `Password must be at least 8 characters (${formData.password.length}/8)` : '✓ Password strength is strong'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password with Eye Icon */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Confirm Password
                </label>

                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white rounded-xl pl-12 pr-12 py-3 text-gray-800 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    disabled={showOtpModal}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                
                {/* Password match indicator */}
                {formData.password_confirmation && !showOtpModal && (
                  <div className="mt-2">
                    <p className={`text-xs font-medium ${
                      formData.password === formData.password_confirmation 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {formData.password === formData.password_confirmation 
                        ? '✓ Passwords match' 
                        : '✗ Passwords do not match'}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || showOtpModal}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline"
                >
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal - Enhanced */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-100 animate-slideUp">

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Verify OTP
              </h2>
              <p className="text-gray-600 mt-2">
                Enter the 6-digit code sent to
              </p>
              <p className="font-semibold text-blue-600 mt-1 text-lg">
                {registeredEmail}
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter OTP"
                autoFocus
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 bg-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-center text-2xl font-semibold tracking-widest"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp("");
                    setLoading(false);
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : "Verify OTP"}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Resend OTP
                </button>
              </p>
            </div>

          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Signup;