import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompanyBank } from "../../../api";

const CompanyBanks = () => {
  const navigate = useNavigate();

  const companyId =
    localStorage.getItem("company_id");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_id: companyId || "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",
    is_primary: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await createCompanyBank(formData);

    console.log(
      "Bank Response:",
      response.data
    );

    alert(
      response?.data?.message ||
      "Bank Details Saved Successfully"
    );

    // Save bank id for loan application
    const bankId =
      response?.data?.data?.id ||
      response?.data?.bank?.id ||
      response?.data?.id;

    if (bankId) {
      localStorage.setItem(
        "bank_id",
        bankId
      );
    }

    // Redirect to Loan Application
    navigate("/loan-application");
  } catch (error) {
    console.error(
      "Bank Save Error:",
      error
    );

    alert(
      error?.response?.data?.message ||
      "Failed To Save Bank Details"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-black mb-8">
          Company Bank Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
          <Input
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
          />

          <Input
            label="Account Holder Name"
            name="account_holder_name"
            value={
              formData.account_holder_name
            }
            onChange={handleChange}
          />

          <Input
            label="Account Number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
          />

          <Input
            label="IFSC Code"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleChange}
          />

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Account Type
            </label>

            <select
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
            >
              <option value="">
                Select Account Type
              </option>
              <option value="Current">
                Current
              </option>
              <option value="Savings">
                Savings
              </option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <input
              type="checkbox"
              name="is_primary"
              checked={formData.is_primary}
              onChange={handleChange}
            />

            <label className="text-gray-700">
              Primary Bank Account
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Saving..."
                : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  ...props
}) => (
  <div>
    <label className="block mb-2 text-gray-700 font-medium">
      {label}
    </label>

    <input
      {...props}
      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
    />
  </div>
);

export default CompanyBanks;