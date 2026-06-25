import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCompanyDetails,
  getCompanyDetails,
  updateCompanyDetails,
  deleteCompany,
  getEntityTypes,
  getCompanyById,
  uploadDocument,
  BASE_URL,
} from "../../../../../api";

// Helper function to format date for API (YYYY-MM-DD)
const formatDateForAPI = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  } catch (error) {
    return "";
  }
};

// Helper function to format date for display
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  try {
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  } catch (error) {
    return "";
  }
};

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

// Shimmer Effect Component
const CompanyShimmer = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
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

const DashboardCompany = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef({});

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [entityTypes, setEntityTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [uploadingSide, setUploadingSide] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    entity_type: "",
    industry_type: "",
    cin_number: "",
    company_email: "",
    company_phone: "",
    gst_number: "",
    pan_number: "",
    udyam_registration_number: "",
    date_of_incorporation: "",
    monthly_revenue: "",
    turnover: "",
    annual_income: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    members: [
      {
        name: "",
        designation: "",
        pan_number: "",
        aadhaar_number: "",
        mobile: "",
        email: "",
        dob: "",
        din_number: "",
        residential_address: "",
        ownership_percentage: "",
        is_authorized_signatory: false,
        cibil_score: "",
      },
    ],
  });

  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        await Promise.all([
          fetchEntityTypes(),
          fetchCompaniesData(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchEntityTypes = async () => {
    try {
      const response = await getEntityTypes();
      setEntityTypes(response?.data?.data || []);
    } catch (error) {
      console.error("Entity Types Error:", error);
    }
  };

  const fetchCompaniesData = async () => {
    try {
      const response = await getCompanyDetails();
      
      let companiesData = [];
      if (response?.data?.data) {
        if (Array.isArray(response.data.data)) {
          companiesData = response.data.data;
        } else if (response.data.data.company) {
          companiesData = [response.data.data.company];
        } else if (response.data.data.id) {
          companiesData = [response.data.data];
        }
      }
      
      setCompanies(companiesData);
      
      if (companiesData.length > 0) {
        setIsEditing(false);
        setIsViewing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Fetch Companies Data Error:", error);
      setIsEditing(true);
    }
  };

  const fetchCompanyDetails = async (companyId) => {
    try {
      setLoading(true);
      const response = await getCompanyById(companyId);
      console.log("Company Details:", response.data);
      setSelectedCompanyDetails(response?.data?.data);
      setIsViewing(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Fetch Company Details Error:", error);
      alert(error?.response?.data?.message || "Failed to fetch company details");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (documentId, file, side = 'single', companyId) => {
    if (!file) return;

    try {
      setUploadingDocId(documentId);
      setUploadingSide(side);

      const formData = new FormData();
      formData.append("document_master_id", documentId);
      formData.append("document_side", side);
      formData.append("file", file);
      
      if (companyId) {
        formData.append("company_id", companyId);
      }

      const leadId = localStorage.getItem("lead_id");
      if (leadId) {
        formData.append("lead_id", leadId);
      }

      console.log("Uploading document:", {
        documentId,
        side,
        fileName: file.name,
        companyId,
        leadId
      });

      const response = await uploadDocument(formData);
      console.log("Upload Response:", response.data);

      alert(response?.data?.message || "Document uploaded successfully");

      if (companyId) {
        await fetchCompanyDetails(companyId);
      }

    } catch (error) {
      console.error("Document Upload Error:", error);
      alert(error?.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingDocId(null);
      setUploadingSide(null);
    }
  };

  const loadCompanyData = (companyData) => {
    setSelectedCompanyId(companyData.id);
    
    const formattedData = {
      company_name: companyData.company_name || "",
      entity_type: companyData.entity_type || "",
      industry_type: companyData.industry_type || "",
      cin_number: companyData.cin_number || "",
      company_email: companyData.company_email || "",
      company_phone: companyData.company_phone || "",
      gst_number: companyData.gst_number || "",
      pan_number: companyData.pan_number || "",
      udyam_registration_number: companyData.udyam_registration_number || "",
      date_of_incorporation: formatDateForDisplay(companyData.date_of_incorporation) || "",
      monthly_revenue: companyData.monthly_revenue || "",
      turnover: companyData.turnover || "",
      annual_income: companyData.annual_income || "",
      address: companyData.address || "",
      city: companyData.city || "",
      state: companyData.state || "",
      pincode: companyData.pincode || "",
      members: companyData.members && companyData.members.length > 0 
        ? companyData.members.map(member => ({
            name: member.name || "",
            designation: member.designation || "",
            pan_number: member.pan_number || "",
            aadhaar_number: member.aadhaar_number || "",
            mobile: member.mobile || "",
            email: member.email || "",
            dob: formatDateForDisplay(member.dob) || "",
            din_number: member.din_number || "",
            residential_address: member.residential_address || "",
            ownership_percentage: member.ownership_percentage || "",
            is_authorized_signatory: member.is_authorized_signatory || false,
            cibil_score: member.cibil_score || "",
          }))
        : [
            {
              name: "",
              designation: "",
              pan_number: "",
              aadhaar_number: "",
              mobile: "",
              email: "",
              dob: "",
              din_number: "",
              residential_address: "",
              ownership_percentage: "",
              is_authorized_signatory: false,
              cibil_score: "",
            },
          ],
    };
    
    setFormData(formattedData);
    setOriginalData(JSON.parse(JSON.stringify(formattedData)));
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMemberChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedMembers = [...formData.members];
    updatedMembers[index][name] = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      members: updatedMembers,
    });
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          name: "",
          designation: "",
          pan_number: "",
          aadhaar_number: "",
          mobile: "",
          email: "",
          dob: "",
          din_number: "",
          residential_address: "",
          ownership_percentage: "",
          is_authorized_signatory: false,
          cibil_score: "",
        },
      ],
    }));
  };

  const removeMember = (index) => {
    if (formData.members.length === 1) return;

    const updatedMembers = formData.members.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      members: updatedMembers,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company_name || !formData.entity_type || 
        !formData.industry_type || !formData.pan_number || 
        !formData.monthly_revenue || !formData.city || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }

    for (let member of formData.members) {
      if (!member.name || !member.designation || !member.pan_number || 
          !member.mobile || !member.ownership_percentage) {
        alert('Please fill in all member details');
        return;
      }
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        monthly_revenue: parseFloat(formData.monthly_revenue) || 0,
        turnover: parseFloat(formData.turnover) || 0,
        annual_income: parseFloat(formData.annual_income) || 0,
        date_of_incorporation: formatDateForAPI(formData.date_of_incorporation),
        members: formData.members.map(member => ({
          ...member,
          dob: formatDateForAPI(member.dob),
          ownership_percentage: parseFloat(member.ownership_percentage) || 0,
          is_authorized_signatory: member.is_authorized_signatory || false,
          cibil_score: parseInt(member.cibil_score) || 0,
        }))
      };

      console.log("Submitting data:", submitData);

      let response;
      if (selectedCompanyId) {
        response = await updateCompanyDetails(selectedCompanyId, submitData);
      } else {
        response = await createCompanyDetails(submitData);
      }

      console.log("Company Response:", response.data);

      const newCompanyId = response?.data?.data?.company?.id || 
                          response?.data?.data?.id || 
                          response?.data?.id;

      if (newCompanyId) {
        localStorage.setItem("company_id", newCompanyId);
      }

      await fetchCompaniesData();
      
      setSelectedCompanyId(null);
      setFormData({
        company_name: "",
        entity_type: "",
        industry_type: "",
        cin_number: "",
        company_email: "",
        company_phone: "",
        gst_number: "",
        pan_number: "",
        udyam_registration_number: "",
        date_of_incorporation: "",
        monthly_revenue: "",
        turnover: "",
        annual_income: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        members: [
          {
            name: "",
            designation: "",
            pan_number: "",
            aadhaar_number: "",
            mobile: "",
            email: "",
            dob: "",
            din_number: "",
            residential_address: "",
            ownership_percentage: "",
            is_authorized_signatory: false,
            cibil_score: "",
          },
        ],
      });
      setIsEditing(false);

      alert(
        response?.data?.message ||
          (selectedCompanyId ? "Company Updated Successfully" : "Company Added Successfully")
      );

      navigate("/dashboard/company");
    } catch (error) {
      console.error("Company Save Error:", error);
      alert(
        error?.response?.data?.message ||
          (selectedCompanyId ? "Failed To Update Company" : "Failed To Save Company")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    loadCompanyData(company);
  };

  const handleView = (company) => {
    fetchCompanyDetails(company.id);
  };

  const handleUploadDocuments = (company) => {
    fetchCompanyDetails(company.id);
  };

  const handleBackToList = () => {
    setIsViewing(false);
    setSelectedCompanyDetails(null);
    setSelectedCompanyId(null);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setSelectedCompanyId(null);
  };

  const handleAddNew = () => {
    setSelectedCompanyId(null);
    setIsViewing(false);
    setSelectedCompanyDetails(null);
    setFormData({
      company_name: "",
      entity_type: "",
      industry_type: "",
      cin_number: "",
      company_email: "",
      company_phone: "",
      gst_number: "",
      pan_number: "",
      udyam_registration_number: "",
      date_of_incorporation: "",
      monthly_revenue: "",
      turnover: "",
      annual_income: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      members: [
        {
          name: "",
          designation: "",
          pan_number: "",
          aadhaar_number: "",
          mobile: "",
          email: "",
          dob: "",
          din_number: "",
          residential_address: "",
          ownership_percentage: "",
          is_authorized_signatory: false,
          cibil_score: "",
        },
      ],
    });
    setOriginalData({});
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteCompany(id);
      alert('Company deleted successfully');
      await fetchCompaniesData();
      if (isViewing) {
        setIsViewing(false);
        setSelectedCompanyDetails(null);
      }
    } catch (error) {
      console.error("Delete Company Error:", error);
      alert(error?.response?.data?.message || 'Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

  // Render Document Upload Section
  const renderDocumentUpload = (doc, companyId) => {
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
                        handleDocumentUpload(doc.id, file, side, companyId);
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

  // Get document status display
  const getDocumentStatus = (doc) => {
    // Check if document has uploaded files
    const hasFiles = doc.uploaded_files && doc.uploaded_files.length > 0;
    
    if (hasFiles) {
      // Check if any file status is 'pending' or 'verified'
      const allVerified = doc.uploaded_files.every(file => file.status === 'verified');
      const hasPending = doc.uploaded_files.some(file => file.status === 'pending');
      
      if (allVerified) {
        return { type: 'verified', label: '✓ Verified', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      } else if (hasPending) {
        return { type: 'verification_pending', label: '⏳ Verification Pending', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      }
      return { type: 'uploaded', label: '✓ Uploaded', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    }
    return { type: 'upload_pending', label: '⏳ Upload Pending', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  };

  // Render Company Details View
  if (isViewing && selectedCompanyDetails) {
    const company = selectedCompanyDetails;
    const kycStatus = company.kyc_status || { is_complete: false, pending_mandatory_count: 0 };
    const companyDocuments = company.company_documents || { 
      pending_documents: [], 
      completed_documents: [],
      is_all_mandatory_completed: false 
    };

    const totalDocs = companyDocuments.pending_documents.length + companyDocuments.completed_documents.length;
    const completedCount = companyDocuments.completed_documents.length;
    const pendingCount = companyDocuments.pending_documents.length;
    const progressPercentage = totalDocs > 0 ? Math.round((completedCount / totalDocs) * 100) : 0;

    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.company_name}</h2>
            <p className="text-gray-600 mt-1">Full company details</p>
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
          {/* KYC Status Banner */}
          {/* <div className={`mb-6 p-4 rounded-lg ${
            kycStatus.is_complete ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">KYC Status</h4>
                <p className="text-sm">{kycStatus.message || 'No status available'}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                kycStatus.is_complete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {kycStatus.is_complete ? '✓ KYC Complete' : `${kycStatus.pending_mandatory_count} Pending`}
              </span>
            </div>
          </div> */}

          {/* Company Details Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Company Name</label>
              <div className="text-gray-900 font-medium">{company.company_name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Entity Type</label>
              <div className="text-gray-900 font-medium">{company.entity_type || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Industry Type</label>
              <div className="text-gray-900 font-medium">{company.industry_type || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">PAN Number</label>
              <div className="text-gray-900 font-medium">{company.pan_number || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">GST Number</label>
              <div className="text-gray-900 font-medium">{company.gst_number || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">CIN Number</label>
              <div className="text-gray-900 font-medium">{company.cin_number || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Company Email</label>
              <div className="text-gray-900 font-medium">{company.company_email || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Company Phone</label>
              <div className="text-gray-900 font-medium">{company.company_phone || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">UDYAM Registration</label>
              <div className="text-gray-900 font-medium">{company.udyam_registration_number || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Date of Incorporation</label>
              <div className="text-gray-900 font-medium">
                {company.date_of_incorporation ? new Date(company.date_of_incorporation).toLocaleDateString() : "Not provided"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Monthly Revenue</label>
              <div className="text-gray-900 font-medium">
                {company.monthly_revenue ? `₹${parseFloat(company.monthly_revenue).toLocaleString()}` : "Not provided"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Turnover</label>
              <div className="text-gray-900 font-medium">
                {company.turnover ? `₹${parseFloat(company.turnover).toLocaleString()}` : "Not provided"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Annual Income</label>
              <div className="text-gray-900 font-medium">
                {company.annual_income ? `₹${parseFloat(company.annual_income).toLocaleString()}` : "Not provided"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <div className="text-gray-900 font-medium">{company.address || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">City</label>
              <div className="text-gray-900 font-medium">{company.city || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">State</label>
              <div className="text-gray-900 font-medium">{company.state || "Not provided"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Pincode</label>
              <div className="text-gray-900 font-medium">{company.pincode || "Not provided"}</div>
            </div>
          </div>

          {/* Members Section */}
          {company.members && company.members.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Members ({company.members.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.members.map((member, index) => (
                  <div key={member.id || index} className={`bg-gray-50 rounded-lg p-4 border ${member.is_authorized_signatory ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-gray-900">{member.name || "N/A"}</span>
                          {member.is_authorized_signatory && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Authorized Signatory</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Designation</label>
                        <div className="text-gray-900 text-sm">{member.designation || "N/A"}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">PAN</label>
                        <div className="text-gray-900 text-sm">{member.pan_number || "N/A"}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Mobile</label>
                        <div className="text-gray-900 text-sm">{member.mobile || "N/A"}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Email</label>
                        <div className="text-gray-900 text-sm">{member.email || "N/A"}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Ownership %</label>
                        <div className="text-gray-900 text-sm">{member.ownership_percentage || "N/A"}%</div>
                      </div>
                      {member.din_number && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500">DIN</label>
                          <div className="text-gray-900 text-sm">{member.din_number}</div>
                        </div>
                      )}
                      {member.cibil_score && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500">CIBIL Score</label>
                          <div className="text-gray-900 text-sm">{member.cibil_score}</div>
                        </div>
                      )}
                      {member.dob && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Date of Birth</label>
                          <div className="text-gray-900 text-sm">{new Date(member.dob).toLocaleDateString()}</div>
                        </div>
                      )}
                      {member.aadhaar_number && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Aadhaar</label>
                          <div className="text-gray-900 text-sm">{member.aadhaar_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Documents Section with Upload */}
          {companyDocuments && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold text-gray-900">Company Documents</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  companyDocuments.is_all_mandatory_completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {companyDocuments.is_all_mandatory_completed ? '✓ All Mandatory Complete' : '⏳ Pending'}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      companyDocuments.is_all_mandatory_completed ? 'bg-green-500' : 'bg-yellow-500'
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
                    {companyDocuments.pending_documents.map((doc) => {
                      const docStatus = getDocumentStatus(doc);
                      
                      return (
                        <div key={doc.id} className={`border rounded-lg p-4 ${docStatus.border} ${docStatus.bg}`}>
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
                            <span className={`text-sm font-medium whitespace-nowrap ml-2 ${docStatus.color}`}>
                              {docStatus.label}
                            </span>
                          </div>

                          {/* Upload Section - Only show for upload pending documents */}
                          {docStatus.type === 'upload_pending' && (
                            renderDocumentUpload(doc, company.id)
                          )}

                          {/* Show uploaded files for documents that are uploaded/verification pending */}
                          {(docStatus.type === 'uploaded' || docStatus.type === 'verification_pending') && doc.uploaded_files && doc.uploaded_files.length > 0 && (
                            <div className="mt-3">
                              <h6 className="text-xs font-medium text-gray-600 mb-1">Uploaded Files:</h6>
                              {doc.uploaded_files.map((file) => {
                                const fullUrl = getFullFileUrl(file.url);
                                return fullUrl ? (
                                  <a
                                    key={file.id}
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline block"
                                  >
                                    View uploaded file
                                  </a>
                                ) : null;
                              })}
                              {docStatus.type === 'verification_pending' && (
                                <p className="text-xs text-blue-600 mt-1">⏳ Your document is being verified by our team.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Documents */}
              {completedCount > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-2">Completed Documents ({completedCount})</h5>
                  <div className="space-y-2">
                    {companyDocuments.completed_documents.map((doc) => {
                      const docStatus = getDocumentStatus(doc);
                      
                      return (
                        <div key={doc.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.document_code}</p>
                            </div>
                            <span className={`text-sm font-medium ${docStatus.color}`}>
                              {docStatus.label}
                            </span>
                          </div>
                          {doc.uploaded_files && doc.uploaded_files.length > 0 && (
                            <div className="mt-2">
                              {doc.uploaded_files.map((file) => {
                                const fullUrl = getFullFileUrl(file.url);
                                return fullUrl ? (
                                  <a
                                    key={file.id}
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline block"
                                  >
                                    View uploaded file
                                  </a>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No Documents Message */}
              {totalDocs === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No documents available for this company.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleEdit(company)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDelete(company.id)}
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
    return <CompanyShimmer />;
  }

  // Show Add New Company Button when no companies exist
  if (companies.length === 0 && !isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
          <p className="text-gray-600 mt-1">No companies found. Add your first company.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Added</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first company</p>
            <button
              onClick={handleAddNew}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              + Add Company
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show View Mode - List of Companies
  if (!isEditing) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
            <p className="text-gray-600 mt-1">View and manage your companies</p>
          </div>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Company
          </button>
        </div>

        <div className="space-y-6">
          {companies.map((company) => {
            const kycStatus = company.kyc_status || { is_complete: false, pending_mandatory_count: 0 };
            const hasPendingDocuments = kycStatus.pending_mandatory_count > 0;
            
            return (
              <div key={company.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="space-y-4">
                  {/* Company Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{company.company_name}</h3>
                      <p className="text-sm text-gray-500">ID: #{company.id}</p>
                      {company.cin_number && (
                        <p className="text-sm text-gray-500">CIN: {company.cin_number}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleView(company)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Show
                      </button>
                      <button
                        onClick={() => handleEdit(company)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* KYC Status Badge */}
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                      kycStatus.is_complete ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <span className={`text-sm font-semibold ${
                        kycStatus.is_complete ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {kycStatus.is_complete ? '✅ KYC Complete' : `⏳ ${kycStatus.pending_mandatory_count} Pending`}
                      </span>
                    </div>

                    {hasPendingDocuments && (
                      <button
                        onClick={() => handleUploadDocuments(company)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Upload Documents
                      </button>
                    )}
                  </div>

                  {/* Company Details Grid - Compact View */}
                  <div className="grid md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Entity Type</label>
                      <div className="text-gray-900 font-medium">{company.entity_type || "Not provided"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Industry Type</label>
                      <div className="text-gray-900 font-medium">{company.industry_type || "Not provided"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">PAN Number</label>
                      <div className="text-gray-900 font-medium">{company.pan_number || "Not provided"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">City</label>
                      <div className="text-gray-900 font-medium">{company.city || "Not provided"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">State</label>
                      <div className="text-gray-900 font-medium">{company.state || "Not provided"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Members</label>
                      <div className="text-gray-900 font-medium">{company.members?.length || 0}</div>
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
          {selectedCompanyId ? "Edit Company Details" : "Add New Company"}
        </h2>
        <p className="text-gray-600 mt-1">
          {selectedCompanyId ? "Update your company information" : "Enter your company information"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="Enter company name"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Entity Type <span className="text-red-500">*</span>
              </label>
              <select
                name="entity_type"
                value={formData.entity_type}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="">Select Entity Type</option>
                {entityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Industry Type <span className="text-red-500">*</span>
              </label>
              <select
                name="industry_type"
                value={formData.industry_type}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="">Select Industry</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Service">Service</option>
                <option value="Trading">Trading</option>
                <option value="Retail">Retail</option>
                <option value="IT">IT</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                CIN Number
              </label>
              <input
                type="text"
                name="cin_number"
                value={formData.cin_number}
                onChange={handleChange}
                placeholder="Enter CIN number"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Company PAN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
                required
                placeholder="Enter company PAN"
                maxLength="10"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                GST Number
              </label>
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="Enter GST number"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Company Email
              </label>
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleChange}
                placeholder="Enter company email"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Company Phone
              </label>
              <input
                type="text"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleChange}
                placeholder="Enter company phone"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Monthly Revenue (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="monthly_revenue"
                value={formData.monthly_revenue}
                onChange={handleChange}
                required
                placeholder="Enter monthly revenue"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Turnover (₹)
              </label>
              <input
                type="number"
                name="turnover"
                value={formData.turnover}
                onChange={handleChange}
                placeholder="Enter annual turnover"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Annual Income (₹)
              </label>
              <input
                type="number"
                name="annual_income"
                value={formData.annual_income}
                onChange={handleChange}
                placeholder="Enter annual income"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Date of Incorporation
              </label>
              <input
                type="date"
                name="date_of_incorporation"
                value={formData.date_of_incorporation}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                UDYAM Registration Number
              </label>
              <input
                type="text"
                name="udyam_registration_number"
                value={formData.udyam_registration_number}
                onChange={handleChange}
                placeholder="Enter UDYAM registration number"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-700 font-medium">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter company address"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                maxLength="6"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>

          {/* Members Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">
                Company Members <span className="text-red-500">*</span>
              </h2>
              <button
                type="button"
                onClick={addMember}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Member
              </button>
            </div>

            {formData.members.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-black">
                    Member {index + 1}
                  </h3>
                  {formData.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                      placeholder="Enter member name"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={member.designation}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                      placeholder="Enter designation"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      PAN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pan_number"
                      value={member.pan_number}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                      placeholder="Enter PAN number"
                      maxLength="10"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadhaar_number"
                      value={member.aadhaar_number}
                      onChange={(e) => handleMemberChange(index, e)}
                      placeholder="Enter Aadhaar number"
                      maxLength="12"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={member.mobile}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                      placeholder="Enter mobile number"
                      maxLength="10"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, e)}
                      placeholder="Enter email"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={member.dob}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      DIN Number
                    </label>
                    <input
                      type="text"
                      name="din_number"
                      value={member.din_number}
                      onChange={(e) => handleMemberChange(index, e)}
                      placeholder="Enter DIN number"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      name="residential_address"
                      value={member.residential_address}
                      onChange={(e) => handleMemberChange(index, e)}
                      placeholder="Enter residential address"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Ownership % <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="ownership_percentage"
                      value={member.ownership_percentage}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                      placeholder="Enter ownership %"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      CIBIL Score
                    </label>
                    <input
                      type="number"
                      name="cibil_score"
                      value={member.cibil_score}
                      onChange={(e) => handleMemberChange(index, e)}
                      placeholder="Enter CIBIL score"
                      min="300"
                      max="900"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        name="is_authorized_signatory"
                        checked={member.is_authorized_signatory}
                        onChange={(e) => handleMemberChange(index, e)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      Authorized Signatory
                    </label>
                  </div>
                </div>
              </div>
            ))}
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
              {loading ? "Saving..." : (selectedCompanyId ? "Update" : "Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardCompany;