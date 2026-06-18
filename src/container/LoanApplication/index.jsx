import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  applyLoan,
  getLoanTypes,
  getBanks,
  getDocuments,
} from "../../../api";

const LoanApplication = () => {
  const navigate = useNavigate();

  const companyId =
    localStorage.getItem("company_id");

  const onboardingData = JSON.parse(
    localStorage.getItem("onboarding_data") || "{}"
  );

  const entityType =
    onboardingData?.company?.entity_type || "";

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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-black mb-8">
          Loan Application
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Loan Amount
            </label>

            <input
              type="number"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              placeholder="Enter Loan Amount"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Bank
            </label>

            <select
              name="bank_id"
              value={formData.bank_id}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
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
              Loan Type
            </label>

            <select
              name="loan_type_id"
              value={
                formData.loan_type_id
              }
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
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

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              {loading
                ? "Submitting..."
                : "Apply Loan & Continue"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LoanApplication;