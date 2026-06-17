// src/api/api.js
import axios from "axios";

export const BASE_URL = "http://192.168.0.110:8000/api";

const API = axios.create({
    baseURL: BASE_URL,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// =========================
// AUTH APIs
// =========================

// Register User
export const registerUser = (formData) =>
    API.post("/register", formData);

// Verify OTP
export const verifyOtp = (formData) =>
    API.post("/verify-otp", formData);

// Login User
export const loginUser = (formData) =>
    API.post("/login", formData);

// Logout User
export const logoutUser = () =>
    API.post("/logout");

export const getUserProfile = () =>
    API.get("/user/profile");

export const updateUserProfile = (data) =>
    API.post("/user/profile", data);

// Forgot Password
export const forgotPassword = (email) =>
    API.post("/forgot-password", { email });

// Reset Password
export const resetPassword = (token, passwords) =>
    API.post(`/reset-password/${token}`, passwords);

// =========================
// TOWER BASED APIs
// =========================

export const getTowers = (slug) =>
    API.get(`/project/${slug}/towers`);

export const getFloorsByTower = (slug, tower_id) =>
    API.get(`/project/${slug}/towers`, {
        params: { tower_id },
    });

export const getUnitsByFloor = (slug, tower_id, floor) =>
    API.get(`/project/${slug}/towers`, {
        params: { tower_id, floor },
    });

export const getUnitDetails = (
    slug,
    tower_id,
    floor,
    unit_number
) =>
    API.get(`/project/${slug}/towers`, {
        params: {
            tower_id,
            floor,
            unit_number,
        },
    });

export default API;