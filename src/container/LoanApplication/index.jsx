import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepperWrapper from "../../routes/MainRoutes/Stepper/components/StepperWrapper";
import {
  applyLoan,
  getLoanTypes,
  getBanks,
} from "../../../api";

const LoanApplication = () => {
  const navigate = useNavigate();

  // Define steps for the stepper
  const steps = [
    { id: 1, label: 'Personal Details', description: 'Your information', path: '/profile' },
    { id: 2, label: 'Company Details', description: 'Business info', path: '/company' },
    { id: 3, label: 'Bank Details', description: 'Bank account', path: '/company-banks' },
    { id: 4, label: 'Loan Application', description: 'Apply for loan', path: '/loan-application' },
    { id: 5, label: 'Document Upload', description: 'Upload documents', path: '/document-upload' }
  ];

  const companyId = localStorage.getItem("company_id");

  const [loading, setLoading] = useState(false);
  const [loanTypes, setLoanTypes] = useState([]);
  const [banks, setBanks] = useState([]);

  const [formData, setFormData] = useState({
    company_id: companyId || "",
    loan_amount: "",
    bank_id: "",
    loan_type_id: "",
  });

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      const [loanRes, bankRes] =
        await Promise.all([
          getLoanTypes(),
          getBanks(),
        ]);

      setLoanTypes(
        loanRes?.data?.data ||
          loanRes?.data ||
          []
      );

      setBanks(
        bankRes?.data?.data ||
          bankRes?.data ||
          []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.loan_amount || !formData.bank_id || !formData.loan_type_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const response =
        await applyLoan(formData);

      console.log(
        "Loan Response:",
        response.data
      );

      const leadId =
        response?.data?.data?.id ||
        response?.data?.lead?.id ||
        response?.data?.id;

      if (leadId) {
        localStorage.setItem(
          "lead_id",
          leadId
        );
      }

      alert(
        response?.data?.message ||
          "Loan Applied Successfully"
      );

      navigate("/document-upload");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed To Apply Loan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (index, step) => {
    // Allow navigation to previous steps
    if (index <= 3) {
      if (step.path) {
        navigate(step.path);
      }
    }
  };

  return (
    <StepperWrapper
      steps={steps}
      currentStep={3}
      onStepClick={handleStepClick}
      title="Loan Application"
      subtitle="Apply for your business loan"
    >
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            required
          />
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

            {banks.map((bank) => (
              <option
                key={bank.id}
                value={bank.id}
              >
                {bank.name ||
                  bank.bank_name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-gray-700">
            Loan Type <span className="text-red-500">*</span>
          </label>

          <select
            name="loan_type_id"
            value={
              formData.loan_type_id
            }
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            required
          >
            <option value="">
              Select Loan Type
            </option>

            {loanTypes.map((loan) => (
              <option
                key={loan.id}
                value={loan.id}
              >
                {loan.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/company-banks')}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "Submitting..."
              : "Apply Loan & Continue →"}
          </button>
        </div>
      </form>
    </StepperWrapper>
  );
};

export default LoanApplication;