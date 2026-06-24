// src/api/api.js
import axios from "axios";

export const BASE_URL = "http://192.168.0.106:8000/api";
// export const BASE_URL = "http://10.124.208.153:8000/api";

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

// Response interceptor for better error handling
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - token expired
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Token might be expired.");
            // Clear localStorage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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

// Forgot Password
export const forgotPassword = (email) =>
    API.post("/forgot-password", { email });

// Reset Password
export const resetPassword = (token, passwords) =>
    API.post(`/reset-password/${token}`, passwords);

// =========================
// LOAN APIs
// =========================

export const applyLoan = async (data) => {
    try {
        const response = await API.post("/user/loan/apply", data);
        console.log("✅ Apply Loan Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Apply Loan Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const getLoanTypes = async () => {
    try {
        const response = await API.get("/master/loan-types");
        console.log("✅ Get Loan Types Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Loan Types Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// MASTER DATA APIs
// =========================

export const getEntityTypes = async () => {
    try {
        const response = await API.get("/master/entity-types");
        console.log("✅ Get Entity Types Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Entity Types Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const getIndustryTypes = async () => {
    try {
        const response = await API.get("/master/industry-types");
        console.log("✅ Get Industry Types Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Industry Types Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const getBanks = async () => {
    try {
        const response = await API.get("/master/banks");
        console.log("✅ Get Banks Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Banks Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// DOCUMENT APIs
// =========================

export const getLeadDocuments = () => {
    const leadId = localStorage.getItem("lead_id");
    return API.get(
        `/master/documents?stage=final_application&lead_id=${leadId}`
    );
};

export const uploadDocument = (data) =>
    API.post(
        "/documents/upload",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

export const finalizeApplication = (leadId) =>
    API.post(`/documents/finalize?lead_id=${leadId}`);

export const getDocuments = (stage, entity_type, loan_type_id) =>
    API.get("/master/documents", {
        params: {
            stage,
            entity_type,
            loan_type_id,
        },
    });

// =========================
// COMPANY APIs
// =========================

/**
 * Get all companies for the authenticated user
 * GET: /api/company
 */
export const getCompanyDetails = async () => {
    try {
        const response = await API.get("/company");
        console.log("✅ Get Company Details Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Company Details Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Get a specific company by ID
 * GET: /api/company/{id}
 */
export const getCompanyById = async (id) => {
    try {
        const response = await API.get(`/company/${id}`);
        console.log("✅ Get Company By ID Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Company By ID Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Create a new company
 * POST: /api/company
 */
export const createCompanyDetails = async (data) => {
    try {
        const response = await API.post("/company", data);
        console.log("✅ Create Company Details Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Create Company Details Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Update an existing company
 * PUT: /api/company/{id}
 */
export const updateCompanyDetails = async (id, data) => {
    try {
        const response = await API.put(`/company/${id}`, data);
        console.log("✅ Update Company Details Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Update Company Details Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Delete a company
 * DELETE: /api/company/{id}
 */
export const deleteCompany = async (id) => {
    try {
        const response = await API.delete(`/company/${id}`);
        console.log("✅ Delete Company Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Delete Company Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// COMPANY MEMBER APIs
// =========================

/**
 * Add a member to a company
 * POST: /api/company/{companyId}/members
 */
export const addCompanyMember = async (companyId, data) => {
    try {
        const response = await API.post(`/company/${companyId}/members`, data);
        console.log("✅ Add Company Member Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Add Company Member Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Update a company member
 * PUT: /api/company/{companyId}/members/{memberId}
 */
export const updateCompanyMember = async (companyId, memberId, data) => {
    try {
        const response = await API.put(`/company/${companyId}/members/${memberId}`, data);
        console.log("✅ Update Company Member Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Update Company Member Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Delete a company member
 * DELETE: /api/company/{companyId}/members/{memberId}
 */
export const deleteCompanyMember = async (companyId, memberId) => {
    try {
        const response = await API.delete(`/company/${companyId}/members/${memberId}`);
        console.log("✅ Delete Company Member Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Delete Company Member Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// COMPANY BANK APIs (DEPRECATED - Use BANK ACCOUNT APIs instead)
// =========================

export const getCompanyBanks = async () => {
    try {
        const response = await API.get("/user/company/banks");
        console.log("✅ Get Company Banks Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Company Banks Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const createCompanyBank = async (data) => {
    try {
        let response;
        
        // Check if we have an ID - if yes, it's an update using POST
        if (data.id) {
            // Update existing bank using POST with ID in URL
            response = await API.post(`/user/company/banks/${data.id}`, data);
            console.log("✅ Update Company Bank Response:", response.data);
        } else {
            // Create new bank using POST
            response = await API.post("/user/company/banks", data);
            console.log("✅ Create Company Bank Response:", response.data);
        }
        return response;
    } catch (error) {
        console.error("❌ Company Bank Save Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const deleteCompanyBank = async (id) => {
    try {
        const response = await API.delete(`/user/company/banks/${id}`);
        console.log("✅ Delete Company Bank Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Delete Company Bank Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// BANK ACCOUNT APIs (NEW)
// =========================

/**
 * Get all bank accounts for the authenticated user
 * GET: /api/bank-accounts
 */
export const getBankAccounts = async () => {
    try {
        const response = await API.get("/bank-accounts");
        console.log("✅ Get Bank Accounts Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Bank Accounts Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Get a specific bank account by ID
 * GET: /api/bank-accounts/{id}
 */
export const getBankAccountById = async (id) => {
    try {
        const response = await API.get(`/bank-accounts/${id}`);
        console.log("✅ Get Bank Account By ID Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Bank Account By ID Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Create a new bank account
 * POST: /api/bank-accounts
 */
export const createBankAccount = async (data) => {
    try {
        const response = await API.post("/bank-accounts", data);
        console.log("✅ Create Bank Account Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Create Bank Account Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Update an existing bank account
 * PUT: /api/bank-accounts/{id}
 */
export const updateBankAccount = async (id, data) => {
    try {
        const response = await API.put(`/bank-accounts/${id}`, data);
        console.log("✅ Update Bank Account Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Update Bank Account Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

/**
 * Delete a bank account
 * DELETE: /api/bank-accounts/{id}
 */
export const deleteBankAccount = async (id) => {
    try {
        const response = await API.delete(`/bank-accounts/${id}`);
        console.log("✅ Delete Bank Account Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Delete Bank Account Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// USER PROFILE APIs
// =========================

export const getUserProfile = async () => {
    try {
        const response = await API.get("/user/profile");
        console.log("✅ Get User Profile Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get User Profile Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const updateUserProfile = async (data) => {
    try {
        const response = await API.post("/user/profile", data);
        console.log("✅ Update User Profile Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Update User Profile Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// =========================
// LOAN APPLICATION APIs
// =========================

export const getLoanApplication = async () => {
    try {
        const response = await API.get("/lead/show");
        console.log("✅ Get Loan Application Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Loan Application Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const getLoanApplicationById = async (leadId) => {
    try {
        const response = await API.get(`/user/loan/${leadId}`);
        console.log("✅ Get Loan Application By ID Response:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Get Loan Application By ID Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export default API;