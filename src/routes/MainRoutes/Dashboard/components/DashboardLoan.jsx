import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLoanTypes,
  getBanks,
  getCompanyDetails,
  getBankAccounts,
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
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item}>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            </div>
          ))}
          
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
  const [isEditing, setIsEditing] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadId, setLeadId] = useState(null);
  const [loanTypes, setLoanTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [formData, setFormData] = useState({
    company_id: "",
    loan_amount: "",
    bank_id: "",
    loan_type_id: "",
    company_bank_account_id: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        await fetchAllData();
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all data in parallel
      await Promise.all([
        fetchCompanies(),
        fetchLoanTypes(),
        fetchBanks(),
        fetchBankAccounts(),
        fetchLeads(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await getCompanyDetails();
      console.log("📦 Companies API Response:", response);
      
      let companiesData = response?.data?.data || [];
      
      // If data is an object with companies array
      if (companiesData && !Array.isArray(companiesData) && companiesData.companies) {
        companiesData = companiesData.companies;
      }
      
      // If it's a single company object, convert to array
      if (companiesData && !Array.isArray(companiesData) && companiesData.id) {
        companiesData = [companiesData];
      }
      
      setCompanies(companiesData);
      console.log("✅ Companies loaded:", companiesData.length);
      
      // Auto-select first company if available
      if (companiesData.length > 0) {
        const firstCompanyId = companiesData[0].id;
        setSelectedCompanyId(firstCompanyId);
        setFormData(prev => ({ ...prev, company_id: firstCompanyId }));
        localStorage.setItem("company_id", firstCompanyId);
      }
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      // Try to get from localStorage
      const localId = localStorage.getItem("company_id");
      if (localId) {
        setSelectedCompanyId(localId);
        setFormData(prev => ({ ...prev, company_id: localId }));
      }
    }
  };

  const fetchLoanTypes = async () => {
    try {
      const response = await getLoanTypes();
      const data = response?.data?.data || response?.data || [];
      setLoanTypes(data);
      console.log("✅ Loan types loaded:", data.length);
    } catch (error) {
      console.error("❌ Error fetching loan types:", error);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await getBanks();
      const data = response?.data?.data || response?.data || [];
      setBanks(data);
      console.log("✅ Banks loaded:", data.length);
    } catch (error) {
      console.error("❌ Error fetching banks:", error);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await getBankAccounts();
      const data = response?.data?.data || [];
      setBankAccounts(data);
      console.log("✅ Bank accounts loaded:", data.length);
    } catch (error) {
      console.error("❌ Error fetching bank accounts:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      const data = response?.data?.data || [];
      setLeads(data);
      console.log("✅ Leads loaded:", data.length);
      
      if (data.length > 0) {
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("❌ Error fetching leads:", error);
      setIsEditing(true);
    }
  };

  const loadLeadData = (lead) => {
    console.log("📝 Loading lead data:", lead);
    setLeadId(lead.id);
    
    // Get bank_id from loan_applications
    let bankId = "";
    if (lead.loan_applications && lead.loan_applications.length > 0) {
      bankId = lead.loan_applications[0].bank_id || "";
    }
    
    const formattedData = {
      company_id: lead.company_id || "",
      loan_amount: lead.loan_amount ? lead.loan_amount.toString() : "",
      bank_id: bankId,
      loan_type_id: lead.loan_type_id || "",
      company_bank_account_id: lead.company_bank_account_id || "",
    };
    
    setSelectedCompanyId(formattedData.company_id);
    setFormData(formattedData);
    setOriginalData(formattedData);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompanyId(companyId);
    setFormData((prev) => ({ ...prev, company_id: companyId }));
    localStorage.setItem("company_id", companyId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure company_id is set
    const companyIdToUse = formData.company_id || selectedCompanyId;
    
    if (!companyIdToUse) {
      alert("Please select a company.");
      return;
    }

    if (!formData.loan_amount || !formData.bank_id || !formData.loan_type_id) {
      alert('Please fill in all required fields');
      return;
    }

    const loanAmount = parseFloat(formData.loan_amount);
    if (isNaN(loanAmount) || loanAmount <= 0) {
      alert('Please enter a valid loan amount greater than 0');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        company_id: parseInt(companyIdToUse),
        loan_amount: parseFloat(formData.loan_amount),
        bank_id: parseInt(formData.bank_id),
        loan_type_id: parseInt(formData.loan_type_id),
        company_bank_account_id: formData.company_bank_account_id ? parseInt(formData.company_bank_account_id) : null,
      };

      console.log("📤 Submitting loan application:", payload);

      let response;
      if (leadId) {
        response = await updateLead(leadId, payload);
      } else {
        response = await createLead(payload);
      }

      console.log("📥 Loan Response:", response.data);

      const newLeadId = response?.data?.data?.lead_id || 
                        response?.data?.data?.id || 
                        response?.data?.id;

      if (newLeadId) {
        localStorage.setItem("lead_id", newLeadId);
      }

      await fetchLeads();
      
      setLeadId(null);
      setFormData({
        company_id: selectedCompanyId,
        loan_amount: "",
        bank_id: "",
        loan_type_id: "",
        company_bank_account_id: "",
      });
      setIsEditing(false);

      alert(
        response?.data?.message ||
        (leadId ? "Loan Application Updated Successfully" : "Loan Applied Successfully")
      );

      navigate("/dashboard/loan-application");
    } catch (error) {
      console.error("❌ Loan Application Error:", error);

      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join("\n");
        alert(errorMessage);
      } else if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert(leadId ? "Failed To Update Loan Application." : "Failed To Apply Loan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lead) => {
    loadLeadData(lead);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setLeadId(null);
  };

  const handleAddNew = () => {
    setLeadId(null);
    setFormData({
      company_id: selectedCompanyId || "",
      loan_amount: "",
      bank_id: "",
      loan_type_id: "",
      company_bank_account_id: "",
    });
    setOriginalData({});
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this loan application?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteLead(id);
      alert('Loan application deleted successfully');
      await fetchLeads();
    } catch (error) {
      console.error("Delete Lead Error:", error);
      alert(error?.response?.data?.message || 'Failed to delete loan application');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-500";
    const colorMap = {
      "New Application": "text-blue-500",
      "In Progress": "text-yellow-500",
      "Approved": "text-green-500",
      "Rejected": "text-red-500",
    };
    return colorMap[status.name] || "text-gray-500";
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (fetchLoading) {
    return <LoanShimmer />;
  }

  // Show Add New Loan Application Button when no leads exist
  if (leads.length === 0 && !isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Loan Applications</h2>
          <p className="text-gray-600 mt-1">No loan applications found. Apply for your first loan.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Loan Applications</h3>
            <p className="text-gray-600 mb-6">Get started by applying for a business loan</p>
            <button
              onClick={handleAddNew}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              + Apply for Loan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show View Mode - List of Loan Applications
  if (!isEditing) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Loan Applications</h2>
            <p className="text-gray-600 mt-1">View and manage your loan applications</p>
          </div>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Apply for Loan
          </button>
        </div>

        <div className="space-y-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="space-y-4">
                {/* Lead Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {lead.lead_number || `Lead #${lead.id}`}
                    </h3>
                    <p className="text-sm text-gray-500">ID: #{lead.id}</p>
                    {lead.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(lead.status)}`}>
                        {lead.status.name}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lead)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Lead Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Company</label>
                    <div className="text-gray-900 font-medium">
                      {lead.company?.company_name || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Loan Amount</label>
                    <div className="text-gray-900 font-medium">
                      {formatCurrency(lead.loan_amount)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Loan Type</label>
                    <div className="text-gray-900 font-medium">
                      {lead.loan_type?.name || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bank</label>
                    <div className="text-gray-900 font-medium">
                      {lead.loan_applications?.[0]?.bank?.name || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bank Account</label>
                    <div className="text-gray-900 font-medium">
                      {lead.bank_account?.bank_name || "Not provided"}
                      {lead.bank_account?.account_number && (
                        <span className="text-sm text-gray-500 ml-2">
                          (****{lead.bank_account.account_number.slice(-4)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                    <div className="text-gray-900 font-medium">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}
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
          {leadId ? "Edit Loan Application" : "Apply for Loan"}
        </h2>
        <p className="text-gray-600 mt-1">
          {leadId ? "Update your loan application" : "Apply for a business loan"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Company Selection */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700">
              Select Company <span className="text-red-500">*</span>
            </label>
            <select
              name="company_id"
              value={selectedCompanyId || formData.company_id}
              onChange={handleCompanyChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              required
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name || `Company ${company.id}`}
                  {company.entity_type && ` (${company.entity_type})`}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Select the company for which you want to apply for a loan</p>
          </div>

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
            {/* <p className="text-xs text-gray-500 mt-1">Enter loan amount in INR (minimum ₹1,000)</p> */}
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
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name || bank.bank_name || `Bank ${bank.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              <option value="">Select Loan Type</option>
              {loanTypes.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.name || `Loan Type ${loan.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Bank Account
            </label>
            <select
              name="company_bank_account_id"
              value={formData.company_bank_account_id}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">Select Bank Account</option>
              {bankAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.bank_name} - {account.account_number}
                </option>
              ))}
            </select>
            {/* <p className="text-xs text-gray-500 mt-1">Optional: Select a bank account for the loan</p> */}
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
              {loading ? "Submitting..." : (leadId ? "Update" : "Apply Loan")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardLoan;