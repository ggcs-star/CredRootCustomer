import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  applyLoan,
  getLoanTypes,
  getBanks,
  getCompanyDetails,
  getLoanApplication,
} from "../../../../../api";

// Shimmer Effect Component
const LoanShimmer = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shimmer fields */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-1 animate-pulse"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          </div>
          <div className="md:col-span-2">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          </div>
          
          <div className="md:col-span-2">
            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          </div>
          
          <div className="md:col-span-2 flex justify-end gap-4">
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardLoan = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loanTypes, setLoanTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [leadId, setLeadId] = useState(null);

  const [formData, setFormData] = useState({
    company_id: "",
    loan_amount: "",
    bank_id: "",
    loan_type_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        
        // First, get company ID
        await fetchCompanyId();
        
        // Then fetch masters data
        await fetchMasters();
        
        // Then fetch existing loan application
        await fetchLoanApplication();
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCompanyId = async () => {
    try {
      // First try to get from localStorage
      let id = localStorage.getItem("company_id");
      
      if (id) {
        console.log("✅ Company ID from localStorage:", id);
        setFormData(prev => ({
          ...prev,
          company_id: id
        }));
        return;
      }
      
      // If not in localStorage, fetch from API
      console.log("🔄 Fetching company details...");
      const response = await getCompanyDetails();
      
      if (response?.data?.data?.id) {
        id = response.data.data.id;
        console.log("✅ Company ID from API:", id);
        
        // Save to localStorage for future use
        localStorage.setItem("company_id", id);
        
        setFormData(prev => ({
          ...prev,
          company_id: id
        }));
      } else {
        console.warn("❌ Company ID not found");
        alert("Company not found. Please complete your company profile first.");
        navigate("/dashboard/company");
      }
    } catch (error) {
      console.error("❌ Error fetching company ID:", error);
      
      // Try to get from localStorage as last resort
      const localId = localStorage.getItem("company_id");
      if (localId) {
        console.log("Using company ID from localStorage (fallback):", localId);
        setFormData(prev => ({
          ...prev,
          company_id: localId
        }));
      } else {
        alert("Company not found. Please complete your company profile first.");
        navigate("/dashboard/company");
      }
    }
  };

  const fetchMasters = async () => {
    try {
      console.log("🔄 Fetching loan types and banks...");
      
      const [loanRes, bankRes] = await Promise.all([
        getLoanTypes(),
        getBanks(),
      ]);

      console.log("📦 Loan Types Response:", loanRes);
      console.log("📦 Banks Response:", bankRes);

      // Handle different response structures
      const loanTypesData = loanRes?.data?.data || loanRes?.data || [];
      const banksData = bankRes?.data?.data || bankRes?.data || [];

      setLoanTypes(loanTypesData);
      setBanks(banksData);

      console.log("✅ Loan types loaded:", loanTypesData.length);
      console.log("✅ Banks loaded:", banksData.length);
    } catch (error) {
      console.error("❌ Error fetching masters data:", error);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      alert("Failed to load loan types and banks. Please refresh and try again.");
    }
  };

  const fetchLoanApplication = async () => {
    try {
      console.log("🔄 Fetching existing loan application...");
      
      const response = await getLoanApplication();
      console.log("📦 Loan Application Response:", response);
      
      // Check if response has data
      if (response?.data?.data?.lead) {
        const leadData = response.data.data.lead;
        console.log("✅ Loan data received:", leadData);
        
        // Get bank_id from loan_applications array
        let bankId = "";
        if (leadData.loan_applications && leadData.loan_applications.length > 0) {
          bankId = leadData.loan_applications[0].bank_id || "";
        }
        
        // Format the data for the form
        const formattedData = {
          company_id: leadData.company_id || formData.company_id,
          loan_amount: leadData.loan_amount ? leadData.loan_amount.toString() : "",
          bank_id: bankId,
          loan_type_id: leadData.loan_type_id || "",
        };
        
        console.log("📝 Formatted data for form:", formattedData);
        
        setFormData(formattedData);
        setLeadId(leadData.id);
        setIsEditMode(true);
        
        // Save lead ID to localStorage
        if (leadData.id) {
          localStorage.setItem("lead_id", leadData.id);
        }
        
        console.log("✅ Loan data loaded successfully!");
      } else {
        console.log("ℹ️ No loan application found, will create new entry");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("❌ Fetch Loan Application Error:", error);
      
      // Log more details about the error
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      // If error is 404 or no data found, it's a new loan application
      if (error.response?.status === 404) {
        console.log("ℹ️ No loan record found (404), will create new entry");
        setIsEditMode(false);
      } else {
        // For other errors, show alert but allow user to proceed
        console.log("Could not fetch loan application. You can still apply for a new loan.");
        setIsEditMode(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate company_id exists
    if (!formData.company_id) {
      alert("Company ID not found. Please complete your company profile first.");
      navigate("/dashboard/company");
      return;
    }

    // Validate required fields
    if (!formData.loan_amount || !formData.bank_id || !formData.loan_type_id) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate loan amount is greater than 0
    const loanAmount = parseFloat(formData.loan_amount);
    if (isNaN(loanAmount) || loanAmount <= 0) {
      alert('Please enter a valid loan amount greater than 0');
      return;
    }

    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        company_id: formData.company_id,
        loan_amount: formData.loan_amount,
        bank_id: formData.bank_id,
        loan_type_id: formData.loan_type_id,
      };

      // If editing, include the lead ID
      if (isEditMode && leadId) {
        payload.id = leadId;
      }

      console.log("📤 Submitting loan application:", payload);

      const response = await applyLoan(payload);
      console.log("📥 Loan Response:", response.data);

      // Save lead ID for document upload
      const newLeadId = response?.data?.data?.id ||
                        response?.data?.lead?.id ||
                        response?.data?.id;

      if (newLeadId) {
        localStorage.setItem("lead_id", newLeadId);
        console.log("💾 Lead ID saved:", newLeadId);
      }

      alert(
        response?.data?.message ||
        (isEditMode ? "Loan Application Updated Successfully" : "Loan Applied Successfully")
      );

      navigate("/dashboard/loan-application");
    } catch (error) {
      console.error("❌ Loan Application Error:", error);

      // Log more details about the error
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      // Handle validation errors from backend
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join("\n");
        alert(errorMessage);
      } else if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert(isEditMode ? "Failed To Update Loan Application. Please try again." : "Failed To Apply Loan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show shimmer while fetching data
  if (fetchLoading) {
    return <LoanShimmer />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Loan Application" : "Loan Application"}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditMode ? "Update your business loan application" : "Apply for your business loan"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Hidden fields */}
          <input
            type="hidden"
            name="company_id"
            value={formData.company_id}
          />

          {leadId && (
            <input
              type="hidden"
              name="id"
              value={leadId}
            />
          )}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Loan Amount (₹) <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              placeholder="Enter Loan Amount"
              min="1000"
              step="1000"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter loan amount in INR (minimum ₹1,000)</p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Bank <span className="text-red-500">*</span>
            </label>

            <select
              name="bank_id"
              value={formData.bank_id}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              required
            >
              <option value="">
                Select Bank
              </option>

              {banks.length > 0 ? (
                banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name || bank.bank_name || `Bank ${bank.id}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>No banks available</option>
              )}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700">
              Loan Type <span className="text-red-500">*</span>
            </label>

            <select
              name="loan_type_id"
              value={formData.loan_type_id}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              required
            >
              <option value="">
                Select Loan Type
              </option>

              {loanTypes.length > 0 ? (
                loanTypes.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.name || `Loan Type ${loan.id}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>No loan types available</option>
              )}
            </select>
          </div>

          {/* Display company info for reference */}
          {/* {formData.company_id && (
            <div className="md:col-span-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Company ID:</span> {formData.company_id}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isEditMode ? "Updating existing loan application" : "Your loan application will be linked to this company"}
              </p>
            </div>
          )} */}

          <div className="md:col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : isEditMode ? "Update" : "Apply Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardLoan;