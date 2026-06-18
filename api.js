// src/api/api.js
import axios from "axios";

export const BASE_URL = "http://192.168.0.100:8000/api";

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

// Loan APIs
export const applyLoan = (data) =>
    API.post("/user/loan/apply", data);

export const getLoanTypes = () =>
    API.get("/master/loan-types");

export const getEntityTypes = () =>
    API.get("/master/entity-types");

// Get Documents
export const getLeadDocuments = () => {
  const leadId = localStorage.getItem("lead_id");

  return API.get(
    `/master/documents?stage=final_application&lead_id=${leadId}`
  );
};

// Upload Document
export const uploadDocument = (data) =>
  API.post(
    "/documents/upload",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

// Final Submit Application
export const finalizeApplication = (
  leadId
) =>
  API.post(
    `/documents/finalize?lead_id=${leadId}`
  );

export const getBanks = () =>
    API.get("/master/banks");

export const getDocuments = (
    stage,
    entity_type,
    loan_type_id
) =>
    API.get("/master/documents", {
        params: {
            stage,
            entity_type,
            loan_type_id,
        },
    });

// Company Bank APIs
export const getCompanyBanks = () =>
    API.get("/user/company/banks");

export const createCompanyBank = (data) =>
    API.post("/user/company/banks", data);

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

export const getCompanyDetails = () =>
    API.get("/user/company");

export const createCompanyDetails = (data) =>
    API.post("/user/company", data);

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