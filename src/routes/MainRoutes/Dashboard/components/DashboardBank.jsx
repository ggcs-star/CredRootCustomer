import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  getBankAccounts, 
  createBankAccount, 
  updateBankAccount, 
  deleteBankAccount,
  getCompanyDetails 
} from "../../../../../api";

// Shimmer Effect Component
const BankShimmer = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item}>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            </div>
          ))}
          
          <div className="flex items-center gap-3 mt-8">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          
          <div className="md:col-span-2 flex justify-end gap-4">
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardBank = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bankId, setBankId] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [companyId, setCompanyId] = useState(null);

  const [formData, setFormData] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",
    is_primary: true,
  });

  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        await fetchCompanyAndBankData();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCompanyAndBankData = async () => {
    try {
      // Fetch company details to get company ID
      const companyResponse = await getCompanyDetails();
      console.log("📦 Company API Response:", companyResponse);
      
      let companyIdFromApi = null;
      
      // Handle both single company and array of companies
      if (companyResponse?.data?.data) {
        if (Array.isArray(companyResponse.data.data) && companyResponse.data.data.length > 0) {
          companyIdFromApi = companyResponse.data.data[0].id;
        } else if (companyResponse.data.data.id) {
          companyIdFromApi = companyResponse.data.data.id;
        }
      }
      
      if (companyIdFromApi) {
        setCompanyId(companyIdFromApi);
        localStorage.setItem("company_id", companyIdFromApi);
      } else {
        const localId = localStorage.getItem("company_id");
        if (localId) {
          setCompanyId(localId);
        } else {
          toast.error("Company not found. Please complete your company profile first.");
          navigate("/dashboard/company");
          return;
        }
      }
      
      // Fetch bank accounts
      await fetchBankAccounts();
    } catch (error) {
      console.error("Error fetching company data:", error);
      const localId = localStorage.getItem("company_id");
      if (localId) {
        setCompanyId(localId);
        await fetchBankAccounts();
      } else {
        toast.error("Company not found. Please complete your company profile first.");
        navigate("/dashboard/company");
      }
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await getBankAccounts();
      console.log("📦 Bank Accounts Response:", response);
      
      const accounts = response?.data?.data || [];
      setBankAccounts(accounts);
      
      if (accounts.length > 0) {
        // Don't auto-select, let user choose which to edit
        setIsEditing(false);
      } else {
        // No bank accounts found, show empty form for new account
        setIsEditing(true);
      }
    } catch (error) {
      console.error("❌ Fetch Bank Accounts Error:", error);
      setIsEditing(true);
    }
  };

  const loadBankAccountData = (account) => {
    setBankId(account.id);
    
    const formattedData = {
      bank_name: account.bank_name || "",
      account_holder_name: account.account_holder_name || "",
      account_number: account.account_number || "",
      ifsc_code: account.ifsc_code || "",
      account_type: account.account_type || "",
      is_primary: account.is_primary === 1 || account.is_primary === true,
    };
    
    setFormData(formattedData);
    setOriginalData(formattedData);
    setIsEditing(true);
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

    // Validate required fields
    if (!formData.bank_name || !formData.account_holder_name || 
        !formData.account_number || !formData.ifsc_code || !formData.account_type) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        bank_name: formData.bank_name,
        account_holder_name: formData.account_holder_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        account_type: formData.account_type,
        is_primary: formData.is_primary ? 1 : 0,
      };

      console.log("📤 Submitting bank data:", payload);

      let response;
      if (bankId) {
        // Update existing bank account
        response = await updateBankAccount(bankId, payload);
        toast.success("Bank Account Updated Successfully");
      } else {
        // Create new bank account
        response = await createBankAccount(payload);
        toast.success("Bank Account Added Successfully");
      }
      
      console.log("📥 Bank Response:", response);

      // Refresh bank accounts list
      await fetchBankAccounts();
      
      // Reset form
      setBankId(null);
      setFormData({
        bank_name: "",
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        account_type: "",
        is_primary: true,
      });
      setIsEditing(false);

      navigate("/dashboard/company-banks");
    } catch (error) {
      console.error("❌ Bank Save Error:", error);

      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join("\n");
        toast.error(errorMessage);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(bankId ? "Failed To Update Bank Account." : "Failed To Save Bank Account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account) => {
    loadBankAccountData(account);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setBankId(null);
  };

  const handleAddNew = () => {
    setBankId(null);
    setFormData({
      bank_name: "",
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      account_type: "",
      is_primary: true,
    });
    setOriginalData({});
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    // Custom confirmation using toast
    const confirmDelete = window.confirm('Are you sure you want to delete this bank account?');
    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      await deleteBankAccount(id);
      toast.success('Bank account deleted successfully');
      await fetchBankAccounts();
    } catch (error) {
      console.error("Delete Bank Error:", error);
      toast.error(error?.response?.data?.message || 'Failed to delete bank account');
    } finally {
      setLoading(false);
    }
  };

  // Show shimmer while fetching data
  if (fetchLoading) {
    return <BankShimmer />;
  }

  // Show Add New Bank Account Button when no accounts exist
  if (bankAccounts.length === 0 && !isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bank Accounts</h2>
          <p className="text-gray-600 mt-1">No bank accounts found. Add your first bank account.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bank Accounts Added</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first bank account</p>
            <button
              onClick={handleAddNew}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              + Add Bank Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show View Mode - List of Bank Accounts
  if (!isEditing) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bank Accounts</h2>
            <p className="text-gray-600 mt-1">View and manage your bank accounts</p>
          </div>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Bank Account
          </button>
        </div>

        <div className="space-y-6">
          {bankAccounts.map((account) => (
            <div key={account.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="space-y-4">
                {/* Bank Account Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{account.bank_name}</h3>
                    <p className="text-sm text-gray-500">ID: #{account.id}</p>
                    {account.is_primary === 1 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                        Primary Account
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Bank Account Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Holder Name</label>
                    <div className="text-gray-900 font-medium">{account.account_holder_name || "Not provided"}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Number</label>
                    <div className="text-gray-900 font-medium">{account.account_number || "Not provided"}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">IFSC Code</label>
                    <div className="text-gray-900 font-medium">{account.ifsc_code || "Not provided"}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Type</label>
                    <div className="text-gray-900 font-medium">{account.account_type || "Not provided"}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                    <div className="text-gray-900 font-medium">
                      {account.created_at ? new Date(account.created_at).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show Edit/Create Form
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {bankId ? "Edit Bank Account" : "Add New Bank Account"}
        </h2>
        <p className="text-gray-600 mt-1">
          {bankId ? "Update your bank account information" : "Enter your bank account information"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
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
              <option value="">Select Account Type</option>
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

          <div className="md:col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : (bankId ? "Update" : "Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardBank;