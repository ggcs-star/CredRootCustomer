import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  uploadDocument,
  BASE_URL,
} from "../../../../../api";

// Helper function to get full file URL
const getFullFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const baseWithoutApi = baseUrl.replace(/\/api$/, '');
  const filePath = url.startsWith('/') ? url : `/${url}`;
  return `${baseWithoutApi}${filePath}`;
};

// Helper function to get verification status color
const getVerificationStatusColor = (status) => {
  const statusMap = {
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'verified': 'text-green-600 bg-green-50 border-green-200',
    'rejected': 'text-red-600 bg-red-50 border-red-200',
    'uploaded': 'text-blue-600 bg-blue-50 border-blue-200',
  };
  return statusMap[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

// Helper function to get verification status label
const getVerificationStatusLabel = (status) => {
  const statusMap = {
    'pending': '⏳ Pending Verification',
    'verified': '✓ Verified',
    'rejected': '✗ Rejected',
    'uploaded': '✓ Uploaded',
  };
  return statusMap[status] || status || 'Unknown';
};

// Shimmer Effect Component
const LoanShimmer = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item}>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-7 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>

            {[1, 2].map((item) => (
              <div key={item} className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((subItem) => (
                    <div key={subItem}>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-1 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded-xl w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardLoan = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef({});

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [loanTypes, setLoanTypes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [uploadingSide, setUploadingSide] = useState(null);
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

  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        await Promise.all([
          fetchCompanies(),
          fetchLoanTypes(),
          fetchBanks(),
          fetchBankAccounts(),
          fetchLeads(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanyDetails();
      console.log("📦 Companies API Response:", response);
      
      let companiesData = response?.data?.data || [];
      
      if (companiesData && !Array.isArray(companiesData) && companiesData.companies) {
        companiesData = companiesData.companies;
      }
      
      if (companiesData && !Array.isArray(companiesData) && companiesData.id) {
        companiesData = [companiesData];
      }
      
      setCompanies(companiesData);
      console.log("✅ Companies loaded:", companiesData.length);
      
      if (companiesData.length > 0) {
        const firstCompanyId = companiesData[0].id;
        setSelectedCompanyId(firstCompanyId);
        setFormData(prev => ({ ...prev, company_id: firstCompanyId }));
        localStorage.setItem("company_id", firstCompanyId);
      }
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
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
        setIsViewing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("❌ Error fetching leads:", error);
      setIsEditing(true);
    }
  };

  const fetchLeadDetails = async (leadId) => {
    try {
      setLoading(true);
      const response = await getLeadById(leadId);
      console.log("📋 Lead Details:", response.data);
      setSelectedLeadDetails(response?.data?.data);
      setIsViewing(true);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Fetch Lead Details Error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch lead details");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (documentId, file, side = 'single', leadId) => {
    if (!file) return;

    try {
      setUploadingDocId(documentId);
      setUploadingSide(side);

      const formData = new FormData();
      formData.append("document_master_id", documentId);
      formData.append("document_side", side);
      formData.append("file", file);
      
      if (leadId) {
        formData.append("lead_id", leadId);
      }

      console.log("Uploading document:", {
        documentId,
        side,
        fileName: file.name,
        leadId
      });

      const response = await uploadDocument(formData);
      console.log("Upload Response:", response.data);

      toast.success(response?.data?.message || "Document uploaded successfully");

      // Refresh lead details to update document status
      if (leadId) {
        await fetchLeadDetails(leadId);
      }

    } catch (error) {
      console.error("Document Upload Error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingDocId(null);
      setUploadingSide(null);
    }
  };

  // Render Document Upload Section for pending documents
  const renderDocumentUpload = (doc, leadId) => {
    const isUploading = uploadingDocId === doc.id;
    const requiredSides = doc.sides_required === 0 ? ['single'] : 
                         doc.sides_required === 1 ? ['front'] : 
                         ['front', 'back'];
    const uploadedSides = doc.uploaded_sides || [];

    return (
      <div className="mt-3 space-y-2">
        {requiredSides.map((side) => {
          const isUploaded = uploadedSides.includes(side);
          const fileKey = `${doc.id}-${side}`;

          return (
            <div key={side} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 w-16">
                {side.charAt(0).toUpperCase() + side.slice(1)}:
              </span>
              {isUploaded ? (
                <span className="text-xs text-green-600">✓ Uploaded</span>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    ref={el => fileInputRef.current[fileKey] = el}
                    type="file"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleDocumentUpload(doc.id, file, side, leadId);
                      }
                      e.target.value = '';
                    }}
                    className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  {isUploading && uploadingSide === side && (
                    <span className="text-xs text-blue-600">Uploading...</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render uploaded documents from all_documents_uploaded
  const renderUploadedDocuments = (documents, title) => {
    if (!documents || documents.length === 0) return null;

    return (
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">{title} ({documents.length})</h5>
        <div className="space-y-2">
          {documents.map((doc, index) => {
            const fullUrl = getFullFileUrl(doc.url);
            const statusColor = getVerificationStatusColor(doc.verification_status);
            const statusLabel = getVerificationStatusLabel(doc.verification_status);
            
            return (
              <div key={doc.id || index} className={`border rounded-lg p-3 ${statusColor}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <span className="text-xs text-gray-500">({doc.code})</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-xs text-gray-500">Side: {doc.side || 'N/A'}</span>
                      {doc.uploaded_at && (
                        <span className="text-xs text-gray-500">Uploaded: {doc.uploaded_at}</span>
                      )}
                    </div>
                    {doc.reject_reason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {doc.reject_reason}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      doc.verification_status === 'verified' ? 'bg-green-100 text-green-700' :
                      doc.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      doc.verification_status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {statusLabel}
                    </span>
                    {fullUrl && (
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View File
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const loadLeadData = (lead) => {
    console.log("📝 Loading lead data:", lead);
    setSelectedLeadId(lead.id);
    
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
    setOriginalData(JSON.parse(JSON.stringify(formattedData)));
    setIsEditing(true);
    setIsViewing(false);
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

    const companyIdToUse = formData.company_id || selectedCompanyId;
    
    if (!companyIdToUse) {
      toast.error("Please select a company.");
      return;
    }

    if (!formData.loan_amount || !formData.bank_id || !formData.loan_type_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loanAmount = parseFloat(formData.loan_amount);
    if (isNaN(loanAmount) || loanAmount <= 0) {
      toast.error('Please enter a valid loan amount greater than 0');
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
      if (selectedLeadId) {
        response = await updateLead(selectedLeadId, payload);
        toast.success("Loan Application Updated Successfully");
      } else {
        response = await createLead(payload);
        toast.success("Loan Applied Successfully");
      }

      console.log("📥 Loan Response:", response.data);

      const newLeadId = response?.data?.data?.lead_id || 
                        response?.data?.data?.id || 
                        response?.data?.id;

      if (newLeadId) {
        localStorage.setItem("lead_id", newLeadId);
      }

      await fetchLeads();
      
      setSelectedLeadId(null);
      setFormData({
        company_id: selectedCompanyId,
        loan_amount: "",
        bank_id: "",
        loan_type_id: "",
        company_bank_account_id: "",
      });
      setIsEditing(false);

      navigate("/dashboard/loan-application");
    } catch (error) {
      console.error("❌ Loan Application Error:", error);

      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join("\n");
        toast.error(errorMessage);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(selectedLeadId ? "Failed To Update Loan Application." : "Failed To Apply Loan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lead) => {
    loadLeadData(lead);
  };

  const handleView = (lead) => {
    fetchLeadDetails(lead.id);
  };

  const handleUploadDocuments = (lead) => {
    fetchLeadDetails(lead.id);
  };

  const handleBackToList = () => {
    setIsViewing(false);
    setSelectedLeadDetails(null);
    setSelectedLeadId(null);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setSelectedLeadId(null);
  };

  const handleAddNew = () => {
    setSelectedLeadId(null);
    setIsViewing(false);
    setSelectedLeadDetails(null);
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
      toast.success('Loan application deleted successfully');
      await fetchLeads();
      if (isViewing) {
        setIsViewing(false);
        setSelectedLeadDetails(null);
      }
    } catch (error) {
      console.error("Delete Lead Error:", error);
      toast.error(error?.response?.data?.message || 'Failed to delete loan application');
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

  const getStatusBadgeColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    const colorMap = {
      "New Application": "bg-blue-100 text-blue-700",
      "In Progress": "bg-yellow-100 text-yellow-700",
      "Approved": "bg-green-100 text-green-700",
      "Rejected": "bg-red-100 text-red-700",
    };
    return colorMap[status.name] || "bg-gray-100 text-gray-700";
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

  // Render Lead Details View
  if (isViewing && selectedLeadDetails) {
    const lead = selectedLeadDetails;
    const docStatus = lead.document_status || { is_ready_for_submission: false, pending_mandatory_count: 0 };
    const allDocs = lead.all_documents_uploaded || {};
    
    // Get documents from all_documents_uploaded
    const personalDocs = allDocs.personal_documents || [];
    const companyDocs = allDocs.company_documents || [];
    const leadDocs = allDocs.lead_documents || [];
    
    // Pending documents from document_status
    const pendingDocs = docStatus.pending_documents || [];
    const pendingCount = pendingDocs.length;
    const completedCount = personalDocs.length + companyDocs.length + leadDocs.length;
    const totalDocs = pendingCount + completedCount;
    const progressPercentage = totalDocs > 0 ? Math.round((completedCount / totalDocs) * 100) : 0;

    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Loan Application #{lead.lead_number}
            </h2>
            <p className="text-gray-600 mt-1">Full loan application details</p>
          </div>
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {/* Document Status Banner */}
          {/* <div className={`mb-6 p-4 rounded-lg ${
            docStatus.is_ready_for_submission ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">Document Status</h4>
                <p className="text-sm">
                  {docStatus.is_ready_for_submission ? 'All mandatory documents uploaded and ready for submission.' : `${docStatus.pending_mandatory_count || pendingCount} document(s) pending`}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                docStatus.is_ready_for_submission ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {docStatus.is_ready_for_submission ? '✓ Ready for Submission' : `${docStatus.pending_mandatory_count || pendingCount} Pending`}
              </span>
            </div>
          </div> */}

          {/* Lead Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Lead Number</label>
              <div className="text-gray-900 font-medium">{lead.lead_number}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Loan Amount</label>
              <div className="text-gray-900 font-medium">{formatCurrency(lead.loan_amount)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Company</label>
              <div className="text-gray-900 font-medium">{lead.company?.company_name || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Entity Type</label>
              <div className="text-gray-900 font-medium">{lead.company?.entity_type || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Loan Type</label>
              <div className="text-gray-900 font-medium">{lead.loan_type?.name || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Bank</label>
              <div className="text-gray-900 font-medium">{lead.loan_applications?.[0]?.bank?.name || "Not provided"}</div>
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
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <div className={`font-medium ${getStatusColor(lead.status)}`}>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                  {lead.status?.name || "N/A"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">CIBIL Score</label>
              <div className="text-gray-900 font-medium">{lead.cibil_score || "Not available"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Created At</label>
              <div className="text-gray-900 font-medium">
                {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Updated At</label>
              <div className="text-gray-900 font-medium">
                {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : "N/A"}
              </div>
            </div>
            {lead.is_pre_qualified && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Pre-qualified</label>
                <div className="text-green-600 font-medium">✓ Yes</div>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold text-gray-900">Documents</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                docStatus.is_ready_for_submission ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {docStatus.is_ready_for_submission ? '✓ All Complete' : `${pendingCount} Pending`}
              </span>

              
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    docStatus.is_ready_for_submission ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{completedCount} completed</span>
                <span>{pendingCount} pending</span>
              </div>
            </div>

            {/* Pending Documents with Upload */}
            {pendingCount > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-yellow-600 mb-2">Pending Documents ({pendingCount})</h5>
                <div className="space-y-3">
                  {pendingDocs.map((doc) => (
                    <div key={doc.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            {doc.is_mandatory && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Mandatory</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{doc.document_code}</p>
                          <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs text-gray-500">Formats: {doc.allowed_formats}</span>
                            <span className="text-xs text-gray-500">Max: {doc.max_size_kb} KB</span>
                            <span className="text-xs text-gray-500">
                              Sides: {doc.sides_required === 0 ? 'Single' : doc.sides_required === 1 ? 'Front' : 'Front & Back'}
                            </span>
                          </div>
                        </div>
                        <span className="text-yellow-600 text-sm font-medium whitespace-nowrap ml-2">⏳ Pending</span>
                      </div>

                      {/* Upload Section */}
                      {renderDocumentUpload(doc, lead.id)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Documents */}
            {renderUploadedDocuments(personalDocs, 'Personal Documents')}

            {/* Company Documents */}
            {renderUploadedDocuments(companyDocs, 'Company Documents')}

            {/* Lead Documents */}
            {renderUploadedDocuments(leadDocs, 'Lead Documents')}

            {/* No Documents Message */}
            {totalDocs === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No documents available for this loan application.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleEdit(lead)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDelete(lead.id)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show shimmer while fetching data
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
  if (!isEditing && !isViewing) {
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
          {leads.map((lead) => {
            const docStatus = lead.document_status || { is_ready_for_submission: false, pending_mandatory_count: 0 };
            const hasPendingDocuments = docStatus.pending_mandatory_count > 0;
            
            return (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="space-y-4">
                  {/* Lead Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {lead.lead_number || `Lead #${lead.id}`}
                      </h3>
                      <p className="text-sm text-gray-500">ID: #{lead.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                          {lead.status?.name || "N/A"}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          docStatus.is_ready_for_submission ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {docStatus.is_ready_for_submission ? '✓ Ready' : `${docStatus.pending_mandatory_count} Pending`}
                        </span>

                             {hasPendingDocuments && (
                        <button
                          onClick={() => handleUploadDocuments(lead)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Upload Documents
                        </button>
                      )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* {hasPendingDocuments && (
                        <button
                          onClick={() => handleUploadDocuments(lead)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Upload Documents
                        </button>
                      )} */}
                      <button
                        onClick={() => handleView(lead)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Show
                      </button>
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

                  {/* Lead Details Grid - Compact View */}
                  <div className="grid md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Company</label>
                      <div className="text-gray-900 font-medium text-sm">
                        {lead.company?.company_name || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Loan Amount</label>
                      <div className="text-gray-900 font-medium text-sm">
                        {formatCurrency(lead.loan_amount)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Loan Type</label>
                      <div className="text-gray-900 font-medium text-sm">
                        {lead.loan_type?.name || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Bank</label>
                      <div className="text-gray-900 font-medium text-sm">
                        {lead.loan_applications?.[0]?.bank?.name || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Bank Account</label>
                      <div className="text-gray-900 font-medium text-sm">
                        {lead.bank_account?.bank_name || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Created At</label>
                      <div className="text-gray-900 font-medium text-sm">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Show Edit/Create Form
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedLeadId ? "Edit Loan Application" : "Apply for Loan"}
        </h2>
        <p className="text-gray-600 mt-1">
          {selectedLeadId ? "Update your loan application" : "Apply for a business loan"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                My Bank Account Detail
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
            </div>
          </div>

          <div className="flex justify-end gap-4">
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
              {loading ? "Submitting..." : (selectedLeadId ? "Update" : "Apply Loan")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardLoan;