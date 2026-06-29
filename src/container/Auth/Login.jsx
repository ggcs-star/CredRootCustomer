import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

import { loginUser, verifyLoginOtp } from "../../../api";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Generate or get device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  // Set device ID in headers for all API calls
  useEffect(() => {
    const deviceId = getDeviceId();
    // Store device ID in state for reference
    setDeviceId(deviceId);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Get current device ID
      const currentDeviceId = getDeviceId();

      // Call login with device ID in headers
      const response = await loginUser({
        ...formData,
        device_id: currentDeviceId // Send in body as well if backend expects it
      }, {
        headers: {
          'X-Device-ID': currentDeviceId // Send in headers
        }
      });

      console.log("Login Response:", response.data);

      // Check if OTP is required
      if (response?.data?.requires_otp === true) {
        setDeviceId(response?.data?.device_id || currentDeviceId);
        setShowOtpModal(true);
        toast.success(response?.data?.message || "OTP sent to your email for verification");
        setLoading(false);
        return;
      }

      // Handle successful login without OTP
      handleSuccessfulLogin(response.data);
      
    } catch (error) {
      console.error("Login Error:", error);

      // Check if error response requires OTP
      if (error?.response?.data?.requires_otp === true) {
        const currentDeviceId = getDeviceId();
        setDeviceId(error?.response?.data?.device_id || currentDeviceId);
        setShowOtpModal(true);
        toast.success(error?.response?.data?.message || "OTP sent to your email for verification");
      } else {
        toast.error(error?.response?.data?.message || "Invalid email or password");
      }
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
      setIsVerifyingOtp(true);
      setLoading(true);

      // Get current device ID
      const currentDeviceId = getDeviceId();

      // Use the separate OTP verification endpoint
      const response = await verifyLoginOtp({
        email: formData.email,
        otp: otp,
        device_id: deviceId || currentDeviceId,
      }, {
        headers: {
          'X-Device-ID': deviceId || currentDeviceId
        }
      });

      console.log("OTP Verify Response:", response.data);

      // Handle successful OTP verification
      if (response?.data?.success !== false) {
        // Close the OTP modal
        setShowOtpModal(false);
        setOtp("");
        
        // Proceed with normal login flow
        handleSuccessfulLogin(response.data);
      } else {
        toast.error(response?.data?.message || "Invalid OTP");
        setOtp("");
      }
      
    } catch (error) {
      console.error("OTP Verification Error:", error);
      
      // Check if the error is about invalid OTP
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
      setOtp("");
    } finally {
      setIsVerifyingOtp(false);
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    const token = data?.access_token || data?.token;
    const user = data?.user;
    const onboardingData = data?.onboarding_data;

    // Save Token
    if (token) {
      localStorage.setItem("token", token);
    }

    // Save User
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Save Onboarding Data
    if (onboardingData) {
      localStorage.setItem("onboarding_data", JSON.stringify(onboardingData));

      // Save Company ID
      if (onboardingData?.company?.id) {
        localStorage.setItem("company_id", onboardingData.company.id);
      }

      // Save Lead ID
      if (onboardingData?.active_lead?.id) {
        localStorage.setItem("lead_id", onboardingData.active_lead.id);
      }

      // Save Bank ID
      if (onboardingData?.bank_accounts?.length > 0) {
        localStorage.setItem("bank_id", onboardingData.bank_accounts[0].id);
      }
    }

    console.log("Saved Company ID:", localStorage.getItem("company_id"));
    console.log("Saved Lead ID:", localStorage.getItem("lead_id"));
    console.log("Saved Bank ID:", localStorage.getItem("bank_id"));

    window.dispatchEvent(new Event("authChanged"));

    toast.success(data?.message || "Login Successful");

    // ALWAYS redirect to dashboard - removed profile check
    navigate("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 transform transition-all duration-500 hover:shadow-3xl">

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
                Welcome Back
              </h2>

              <p className="text-blue-100 text-lg leading-relaxed">
                Login to manage your credit products and financial services.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Secure & Fast Login</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Manage Your Financial Products</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>24/7 Account Access</span>
                </div>
              </div>

              <img
                src="https://illustrations.popsy.co/blue/sign-in.svg"
                alt="login"
                className="mt-10 max-w-sm mx-auto"
              />
            </div>
          </div>

          {/* Right Side - Enhanced */}
          <div className="p-10 md:p-14 bg-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-500 mt-2">Login to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

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
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white text-black rounded-xl pl-12 pr-4 py-3 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white text-black rounded-xl pl-12 pr-12 py-3 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
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
                    Logging In...
                  </span>
                ) : "Login"}
              </button>

              {/* Signup Link */}
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline"
                >
                  Sign Up
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
                {formData.email}
              </p>
              {deviceId && (
                <p className="text-xs text-gray-400 mt-3 bg-gray-50 px-3 py-1.5 rounded-full inline-block">
                  Device ID: {deviceId.substring(0, 8)}...
                </p>
              )}
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
                    setIsVerifyingOtp(false);
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || isVerifyingOtp}
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

export default Login;