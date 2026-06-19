import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepperWrapper from "../../routes/MainRoutes/Stepper/components/StepperWrapper";
import { createCompanyBank } from "../../../api";

const CompanyBanks = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);

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

  // Get company_id from localStorage on component mount
  useEffect(() => {
    const getCompanyId = () => {
      // First try to get from localStorage directly
      let id = localStorage.getItem("company_id");
      
      if (id) {
        console.log("Company ID from localStorage:", id);
        return id;
      }
      
      // If not found, try to get from onboarding_data
      try {
        const onboardingData = JSON.parse(
          localStorage.getItem("onboarding_data") || "{}"
        );
        
        id = onboardingData?.company?.id;
        
        if (id) {
          console.log("Company ID from onboarding_data:", id);
          // Save it back to localStorage for future use
          localStorage.setItem("company_id", id);
          return id;
        }
      } catch (error) {
        console.error("Error parsing onboarding_data:", error);
      }
      
      // If still not found, try to get from user data
      try {
        const userData = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
        if (userData?.company?.id) {
          id = userData.company.id;
          localStorage.setItem("company_id", id);
          return id;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
      
      return null;
    };

    const id = getCompanyId();
    setCompanyId(id);
    
    // Update form data with company_id
    setFormData(prev => ({
      ...prev,
      company_id: id || ""
    }));

    // Log if company_id is not found (for debugging only)
    if (!id) {
      console.warn("Company ID not found in localStorage");
    }
  }, []);

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

      console.log("Submitting bank data:", formData);

      const response = await createCompanyBank(formData);

      console.log("Bank Response:", response.data);

      alert(response?.data?.message || "Bank Details Saved Successfully");

      // Save bank id for loan application
      const bankId = response?.data?.data?.id ||
                     response?.data?.bank?.id ||
                     response?.data?.id;

      if (bankId) {
        localStorage.setItem("bank_id", bankId);
        console.log("Bank ID saved:", bankId);
      }

      // Redirect to Loan Application
      navigate("/loan-application");
    } catch (error) {
      console.error("Bank Save Error:", error);

      // Handle validation errors from backend
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join("\n");
        alert(errorMessage);
      } else if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed To Save Bank Details. Please try again.");
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

  return (
    <StepperWrapper
      steps={steps}
      currentStep={2}
      onStepClick={handleStepClick}
      title="Company Bank Details"
      subtitle="Add your company bank account"
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
            {loading ? "Saving..." : "Save & Continue →"}
          </button>
        </div>
      </form>
    </StepperWrapper>
  );
};

export default CompanyBanks;