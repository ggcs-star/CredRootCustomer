import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepperWrapper from "../../routes/MainRoutes/Stepper/components/StepperWrapper";
import { createCompanyBank, getCompanyBanks, getCompanyDetails } from "../../../api";

const CompanyBanks = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [bankId, setBankId] = useState(null);

  // Define steps for the stepper
  const steps = [
    { id: 1, label: 'Personal Details', description: 'Your information', path: '/profile' },
    { id: 2, label: 'Company Details', description: 'Business info', path: '/company' },
    { id: 3, label: 'Bank Details', description: 'Bank account', path: '/company-banks' },
    { id: 4, label: 'Loan Application', description: 'Apply for loan', path: '/loan-application' },
    { id: 5, label: 'Document Upload', description: 'Upload documents', path: '/document-upload' }
  ];

  const [formData, setFormData] = useState({
    company_id: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",
    is_primary: true,
  });

  // Get company_id from API on component mount
  useEffect(() => {
    const fetchCompanyAndBankData = async () => {
      try {
        setFetchLoading(true);
        
        // First, fetch company details to get the company ID
        console.log("🔄 Fetching company details...");
        const companyResponse = await getCompanyDetails();
        console.log("📦 Company API Response:", companyResponse);
        
        if (companyResponse?.data?.data?.id) {
          const companyIdFromApi = companyResponse.data.data.id;
          console.log("✅ Company ID from API:", companyIdFromApi);
          
          setCompanyId(companyIdFromApi);
          
          // Save company_id to localStorage
          localStorage.setItem("company_id", companyIdFromApi);
          
          // Update form data with company_id
          setFormData(prev => ({
            ...prev,
            company_id: companyIdFromApi
          }));
          
          // Now fetch bank data
          await fetchBankData(companyIdFromApi);
        } else {
          console.warn("❌ Company ID not found in API response");
          
          // Try to get from localStorage as fallback
          const localId = localStorage.getItem("company_id");
          if (localId) {
            console.log("Using company ID from localStorage:", localId);
            setCompanyId(localId);
            setFormData(prev => ({
              ...prev,
              company_id: localId
            }));
            await fetchBankData(localId);
          } else {
            alert("Company not found. Please complete your company profile first.");
            navigate("/company");
          }
        }
      } catch (error) {
        console.error("❌ Error fetching company data:", error);
        
        // Try to get from localStorage as fallback
        const localId = localStorage.getItem("company_id");
        if (localId) {
          console.log("Using company ID from localStorage (fallback):", localId);
          setCompanyId(localId);
          setFormData(prev => ({
            ...prev,
            company_id: localId
          }));
          await fetchBankData(localId);
        } else {
          alert("Company not found. Please complete your company profile first.");
          navigate("/company");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCompanyAndBankData();
  }, []);

  const fetchBankData = async (companyIdParam) => {
    try {
      console.log("🔄 Fetching bank data for company:", companyIdParam);
      
      const response = await getCompanyBanks();
      console.log("📦 Full API Response:", response);
      
      // Check if response has data
      if (response?.data?.data) {
        const bankData = response.data.data;
        console.log("✅ Bank data received:", bankData);
        
        // Format the data for the form
        const formattedData = {
          company_id: bankData.company_id || companyIdParam,
          bank_name: bankData.bank_name || "",
          account_holder_name: bankData.account_holder_name || "",
          account_number: bankData.account_number || "",
          ifsc_code: bankData.ifsc_code || "",
          account_type: bankData.account_type || "",
          is_primary: bankData.is_primary === 1 || bankData.is_primary === true,
        };
        
        console.log("📝 Formatted data for form:", formattedData);
        
        setFormData(formattedData);
        setBankId(bankData.id);
        setIsEditMode(true);
        
        // Save bank id to localStorage
        if (bankData.id) {
          localStorage.setItem("bank_id", bankData.id);
        }
        
        console.log("✅ Bank data loaded successfully!");
      } else {
        console.log("ℹ️ No bank data found, will create new entry");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("❌ Fetch Bank Data Error:", error);
      
      // Log more details about the error
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      // If error is 404 or no data found, it's a new bank creation
      if (error.response?.status === 404) {
        console.log("ℹ️ No bank record found (404), will create new entry");
        setIsEditMode(false);
      } else {
        // For other errors, show alert but allow user to proceed
        alert("Could not fetch bank details. You can still add new bank information.");
        setIsEditMode(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate company_id exists
    if (!formData.company_id) {
      alert("Company ID not found. Please complete your company profile first.");
      navigate("/company");
      return;
    }

    // Validate required fields
    if (!formData.bank_name || !formData.account_holder_name || 
        !formData.account_number || !formData.ifsc_code || !formData.account_type) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Prepare payload - convert is_primary to number for API
      const payload = {
        company_id: formData.company_id,
        bank_name: formData.bank_name,
        account_holder_name: formData.account_holder_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        account_type: formData.account_type,
        is_primary: formData.is_primary ? 1 : 0,
      };

      console.log("📤 Submitting bank data:", payload);
      console.log("isEditMode:", isEditMode);
      console.log("bankId:", bankId);

      let response;
      
      // If editing, pass bankId separately to the API function
      if (isEditMode && bankId) {
        console.log("🔄 Updating bank with ID:", bankId);
        response = await createCompanyBank(payload, bankId); // Pass bankId as second parameter
      } else {
        console.log("🆕 Creating new bank");
        response = await createCompanyBank(payload); // Create new
      }
      
      console.log("📥 Bank Response:", response);

      alert(
        response?.data?.message || 
        (isEditMode ? "Bank Details Updated Successfully" : "Bank Details Saved Successfully")
      );

      // Save bank id for loan application
      const newBankId = response?.data?.data?.id ||
                        response?.data?.bank?.id ||
                        response?.data?.id;

      if (newBankId) {
        localStorage.setItem("bank_id", newBankId);
        console.log("💾 Bank ID saved:", newBankId);
      }

      // Redirect to Loan Application
      navigate("/loan-application");
    } catch (error) {
      console.error("❌ Bank Save Error:", error);

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
        alert(isEditMode ? "Failed To Update Bank Details. Please try again." : "Failed To Save Bank Details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (index, step) => {
    // Allow navigation to previous steps
    if (index <= 2) {
      if (step.path) {
        navigate(step.path);
      }
    }
  };

  // Show loading state while fetching data
  if (fetchLoading) {
    return (
      <StepperWrapper
        steps={steps}
        currentStep={2}
        onStepClick={handleStepClick}
        title="Company Bank Details"
        subtitle="Loading bank details..."
      >
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading bank details...</p>
          </div>
        </div>
      </StepperWrapper>
    );
  }

  return (
    <StepperWrapper
      steps={steps}
      currentStep={2}
      onStepClick={handleStepClick}
      title={isEditMode ? "Edit Company Bank Details" : "Company Bank Details"}
      subtitle={isEditMode ? "Update your company bank account" : "Add your company bank account"}
    >
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Hidden company_id field */}
        <input
          type="hidden"
          name="company_id"
          value={formData.company_id}
        />

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            required
            placeholder="Enter bank name"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="account_holder_name"
            value={formData.account_holder_name}
            onChange={handleChange}
            required
            placeholder="Enter account holder name"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            required
            placeholder="Enter account number"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleChange}
            required
            placeholder="Enter IFSC code"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Account Type <span className="text-red-500">*</span>
          </label>

          <select
            name="account_type"
            value={formData.account_type}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="">
              Select Account Type
            </option>
            <option value="Current">Current</option>
            <option value="Savings">Savings</option>
          </select>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <input
            type="checkbox"
            name="is_primary"
            checked={formData.is_primary}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
          />

          <label className="text-gray-700 font-medium">
            Primary Bank Account
          </label>
        </div>

        <div className="md:col-span-2 flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/company')}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEditMode ? "Update & Continue →" : "Save & Continue →"}
          </button>
        </div>
      </form>
    </StepperWrapper>
  );
};

export default CompanyBanks;