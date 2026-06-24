import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { loginUser, verifyLoginOtp } from "../../../api";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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
        alert(response?.data?.message || "OTP sent to your email for verification");
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
        alert(error?.response?.data?.message || "OTP sent to your email for verification");
      } else {
        alert(error?.response?.data?.message || "Invalid email or password");
      }
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
        alert(response?.data?.message || "Invalid OTP");
        setOtp("");
      }
      
    } catch (error) {
      console.error("OTP Verification Error:", error);
      
      // Check if the error is about invalid OTP
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Invalid OTP. Please try again.");
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

    alert(data?.message || "Login Successful");

    // Check if profile is filled
    const isProfileFilled = checkProfileFilled(user);

    if (!isProfileFilled) {
      // Profile is not filled, redirect to profile page
      navigate("/profile");
    } else {
      // Profile is filled, redirect to dashboard
      navigate("/dashboard");
    }
  };

  // Function to check if profile is filled
  const checkProfileFilled = (user) => {
    // If user doesn't have profile data, it's not filled
    if (!user) return false;

    // Check if user has required profile fields
    const requiredFields = [
      'dob',
      'gender',
      'aadhaar_number',
      'pan_number',
      'occupation'
    ];

    // Check if all required fields are present and not empty
    const allFieldsPresent = requiredFields.every(field => {
      return user[field] && user[field].toString().trim() !== '';
    });

    return allFieldsPresent;
  };

  return (
    <>
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
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white text-black rounded-xl pl-12 pr-4 py-3 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    disabled={showOtpModal}
                    className="w-full border-2 border-gray-300 bg-white text-black rounded-xl pl-12 pr-4 py-3 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                disabled={loading || showOtpModal}
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
                {formData.email}
              </span>
              {deviceId && (
                <span className="block text-sm text-gray-500 mt-2">
                  Device ID: {deviceId}
                </span>
              )}
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              autoFocus
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900 placeholder-gray-400 bg-white outline-none focus:border-blue-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setLoading(false);
                  setIsVerifyingOtp(false);
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || isVerifyingOtp}
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

export default Login;