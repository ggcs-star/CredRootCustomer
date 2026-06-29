import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  IoHome,
  IoDocumentText,
  IoPerson,
  IoLogOut,
  IoChevronDown,
  IoChevronUp,
  IoCheckmarkCircle,
  IoTime,
  IoAlertCircle,
  IoWallet,
} from "react-icons/io5";
import { 
  FaUniversity, 
  FaFileUpload,
  FaUserCircle,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";
import { 
  logoutUser, 
  getUserProfile, 
  getCompanyDetails, 
  getBankAccounts,
  getLeads,
  getLeadDocuments
} from "../../../../api";

// Dashboard Shimmer Effect Component
const DashboardShimmer = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Shimmer - Fixed/Sticky */}
      <aside className="bg-white shadow-lg w-64 flex flex-col h-screen sticky top-0 flex-shrink-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <li key={item}>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((subItem) => (
                    <div key={subItem} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [bankData, setBankData] = useState(null);
  const [leadsData, setLeadsData] = useState([]);
  const [documentData, setDocumentData] = useState(null);
  const [accountOverview, setAccountOverview] = useState(null);

  // Update active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") {
      setActiveTab("overview");
    } else if (path === "/dashboard/profile") {
      setActiveTab("profile");
    } else if (path === "/dashboard/company") {
      setActiveTab("company");
    } else if (path === "/dashboard/company-banks") {
      setActiveTab("bank");
    } else if (path === "/dashboard/loan-application") {
      setActiveTab("loan");
    } else if (path === "/dashboard/document-upload") {
      setActiveTab("documents");
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        await Promise.all([
          fetchProfile(),
          fetchCompanies(),
          fetchBank(),
          fetchLeads(),
          fetchDocuments()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfileData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await getCompanyDetails();
      const companiesData = response?.data?.data || [];
      setCompanies(companiesData);
      
      if (companiesData.length > 0 && !localStorage.getItem("company_id")) {
        localStorage.setItem("company_id", companiesData[0].id);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    }
  };

  const fetchBank = async () => {
    try {
      const response = await getBankAccounts();
      const data = response?.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        setBankData(data[0]);
      } else if (data && !Array.isArray(data)) {
        setBankData(data);
      } else {
        setBankData(null);
      }
    } catch (error) {
      console.error("Error fetching bank:", error);
      setBankData(null);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      const data = response?.data?.data || [];
      setLeadsData(data);
      
      if (data.length > 0 && !localStorage.getItem("lead_id")) {
        localStorage.setItem("lead_id", data[0].id);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeadsData([]);
    }
  };

  const fetchDocuments = async () => {
    try {
      const leadId = localStorage.getItem("lead_id");
      if (leadId) {
        const response = await getLeadDocuments(leadId);
        const data = response?.data?.data || {};
        setDocumentData(data);
        setAccountOverview(data?.account_overview || null);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocumentData(null);
      setAccountOverview(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("company_id");
      localStorage.removeItem("bank_id");
      localStorage.removeItem("lead_id");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <IoHome className="w-5 h-5" />, path: "/dashboard" },
    { id: "profile", label: "Profile", icon: <FaUserCircle className="w-5 h-5" />, path: "/dashboard/profile" },
    { id: "company", label: "Company", icon: <FaBuilding className="w-5 h-5" />, path: "/dashboard/company" },
    { id: "bank", label: "Bank Details", icon: <FaUniversity className="w-5 h-5" />, path: "/dashboard/company-banks" },
    { id: "documents", label: "Documents", icon: <FaFileUpload className="w-5 h-5" />, path: "/dashboard/document-upload" },
    { id: "loan", label: "Loan Application", icon: <FaFileAlt className="w-5 h-5" />, path: "/dashboard/loan-application" },
  ];

  const getStatusColor = (status) => {
    if (!status) return "text-gray-500";
    const statusMap = {
      "New Application": "text-blue-500",
      "In Progress": "text-yellow-500",
      "Approved": "text-green-500",
      "Rejected": "text-red-500",
    };
    return statusMap[status] || "text-gray-500";
  };

  const getStatusIcon = (status) => {
    if (!status) return <IoTime className="w-5 h-5" />;
    const statusMap = {
      "New Application": <IoTime className="w-5 h-5" />,
      "In Progress": <IoTime className="w-5 h-5" />,
      "Approved": <IoCheckmarkCircle className="w-5 h-5" />,
      "Rejected": <IoAlertCircle className="w-5 h-5" />,
    };
    return statusMap[status] || <IoTime className="w-5 h-5" />;
  };

  const getDocumentStatusSummary = () => {
    if (!documentData) return { total: 0, completed: 0, isComplete: false };
    
    const personalProfile = documentData?.personal_profile || {};
    const businessProfiles = documentData?.business_profiles || [];
    const loanApps = documentData?.loan_applications || [];
    
    let totalMandatory = 0;
    let completedMandatory = 0;
    
    const personalPending = personalProfile?.pending_documents || [];
    const personalCompleted = personalProfile?.completed_documents || [];
    const personalMandatory = personalPending.filter(d => d.is_mandatory).length;
    const personalCompletedMandatory = personalCompleted.filter(d => d.is_mandatory).length;
    totalMandatory += personalMandatory + personalCompletedMandatory;
    completedMandatory += personalCompletedMandatory;
    
    businessProfiles.forEach(business => {
      const docStatus = business?.document_status || {};
      const pending = docStatus?.pending_documents || [];
      const completed = docStatus?.completed_documents || [];
      const mandatory = pending.filter(d => d.is_mandatory).length;
      const completedMandatoryCount = completed.filter(d => d.is_mandatory).length;
      totalMandatory += mandatory + completedMandatoryCount;
      completedMandatory += completedMandatoryCount;
    });
    
    loanApps.forEach(loan => {
      const docStatus = loan?.document_status || {};
      const pending = docStatus?.pending_documents || [];
      const completed = docStatus?.completed_documents || [];
      const mandatory = pending.filter(d => d.is_mandatory).length;
      const completedMandatoryCount = completed.filter(d => d.is_mandatory).length;
      totalMandatory += mandatory + completedMandatoryCount;
      completedMandatory += completedMandatoryCount;
    });
    
    return {
      total: totalMandatory,
      completed: completedMandatory,
      isComplete: totalMandatory > 0 && completedMandatory === totalMandatory
    };
  };

  const getFirstLead = () => {
    if (leadsData.length === 0) return null;
    return leadsData[0];
  };

  const getCompanyName = () => {
    if (companies.length === 0) return "Not Set";
    const companyId = localStorage.getItem("company_id");
    if (companyId) {
      const company = companies.find(c => c.id === parseInt(companyId));
      if (company) return company.company_name;
    }
    return companies[0]?.company_name || "Not Set";
  };

  const isNestedRoute = location.pathname !== "/dashboard";

  if (loading) {
    return <DashboardShimmer />;
  }

  const docStatus = getDocumentStatusSummary();
  const firstLead = getFirstLead();

  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar - Sticky/Fixed */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col h-screen sticky top-0 flex-shrink-0 overflow-y-auto`}
        style={{ position: 'sticky', top: 0 }}
      >
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition flex-shrink-0 ml-auto"
            >
              {isSidebarOpen ? (
                <IoChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <IoChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t bg-white sticky bottom-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <IoLogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {isNestedRoute ? (
            <Outlet />
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name || "User"}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's an overview of your loan application status
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 truncate">
                        {getCompanyName()}
                      </p>
                      {companies.length > 1 && (
                        <p className="text-xs text-gray-500">{companies.length} companies</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaBuilding className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {firstLead?.loan_amount ? `₹${parseFloat(firstLead.loan_amount).toLocaleString()}` : "Not Applied"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <IoWallet className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Loan Type</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 truncate">
                        {firstLead?.loan_type?.name || "Not Selected"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <IoDocumentText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className={`text-lg font-semibold mt-1 ${getStatusColor(firstLead?.status?.name)}`}>
                        {firstLead?.status?.name || "Not Started"}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      firstLead?.status?.name === "New Application" ? "bg-blue-100" :
                      firstLead?.status?.name === "Approved" ? "bg-green-100" :
                      firstLead?.status?.name === "Rejected" ? "bg-red-100" :
                      "bg-gray-100"
                    }`}>
                      <span className={`${
                        firstLead?.status?.name === "New Application" ? "text-blue-600" :
                        firstLead?.status?.name === "Approved" ? "text-green-600" :
                        firstLead?.status?.name === "Rejected" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {getStatusIcon(firstLead?.status?.name)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {documentData && (
                <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFileUpload className="w-6 h-6 text-orange-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Document Upload Status</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        docStatus.isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {docStatus.isComplete ? '✓ All Complete' : '⏳ In Progress'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          docStatus.isComplete ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${docStatus.total > 0 ? (docStatus.completed / docStatus.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {accountOverview && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`rounded-lg p-3 text-center ${
                        accountOverview.personal_kyc_complete 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <p className="text-sm text-gray-600">Personal KYC</p>
                        <p className="text-sm font-semibold text-black">
                          {accountOverview.personal_kyc_complete ? '✅ Complete' : '⏳ Pending'}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                        <p className="text-sm text-gray-600">Businesses</p>
                        <p className="text-sm font-semibold text-black">{accountOverview.total_businesses}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                        <p className="text-sm text-gray-600">Loans in Progress</p>
                        <p className="text-sm font-semibold text-black">{accountOverview.total_loans_in_progress}</p>
                      </div>
                    </div>
                  )}

                  <Link
                    to="/dashboard/document-upload"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Documents →
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaBuilding className="w-5 h-5 text-blue-600" />
                    Company Details
                  </h2>
                  {companies.length > 0 ? (
                    <div className="space-y-3">
                      {companies.slice(0, 1).map((company) => (
                        <div key={company.id}>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Company Name</span>
                            <span className="font-medium text-gray-900">{company.company_name}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-600">PAN Number</span>
                            <span className="font-medium text-gray-900">{company.pan_number || "N/A"}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-600">Entity Type</span>
                            <span className="font-medium text-gray-900">{company.entity_type || "N/A"}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-600">Industry</span>
                            <span className="font-medium text-gray-900">{company.industry_type || "N/A"}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-600">City</span>
                            <span className="font-medium text-gray-900">{company.city || "N/A"}</span>
                          </div>
                        </div>
                      ))}
                      {companies.length > 1 && (
                        <p className="text-sm text-blue-600 mt-2">
                          + {companies.length - 1} more companies
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No company details found</p>
                  )}
                  <Link
                    to="/dashboard/company"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {companies.length > 0 ? "Manage Companies →" : "Add Company →"}
                  </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUniversity className="w-5 h-5 text-green-600" />
                    Bank Details
                  </h2>
                  {bankData ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name</span>
                        <span className="font-medium text-gray-900">{bankData.bank_name || bankData.name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Holder</span>
                        <span className="font-medium text-gray-900">{bankData.account_holder_name || bankData.holder_name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number</span>
                        <span className="font-medium text-gray-900">{bankData.account_number || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IFSC Code</span>
                        <span className="font-medium text-gray-900">{bankData.ifsc_code || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Type</span>
                        <span className="font-medium text-gray-900">{bankData.account_type || "N/A"}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No bank details found</p>
                  )}
                  <Link
                    to="/dashboard/company-banks"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {bankData ? "Edit Bank Details →" : "Add Bank Details →"}
                  </Link>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <IoDocumentText className="w-5 h-5 text-purple-600" />
                    Loan Application Details
                  </h2>
                  {firstLead ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Lead Number</span>
                          <span className="font-medium text-gray-900">{firstLead.lead_number || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Loan Amount</span>
                          <span className="font-medium text-gray-900">₹{parseFloat(firstLead.loan_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Loan Type</span>
                          <span className="font-medium text-gray-900">{firstLead.loan_type?.name || "N/A"}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-medium ${getStatusColor(firstLead.status?.name)}`}>
                            {firstLead.status?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Created At</span>
                          <span className="font-medium text-gray-900">
                            {firstLead.created_at ? new Date(firstLead.created_at).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Company</span>
                          <span className="font-medium text-gray-900">
                            {firstLead.company?.name || firstLead.company_name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No loan application found</p>
                  )}
                  <Link
                    to="/dashboard/loan-application"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {firstLead ? "Update Loan Application →" : "Apply for Loan →"}
                  </Link>
                </div>

                <div className="lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                      to="/dashboard/profile"
                      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition text-center"
                    >
                      <FaUserCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">Update Profile</span>
                    </Link>
                    <Link
                      to="/dashboard/company"
                      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition text-center"
                    >
                      <FaBuilding className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {companies.length > 0 ? "Manage Companies" : "Add Company"}
                      </span>
                    </Link>
                    <Link
                      to="/dashboard/company-banks"
                      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition text-center"
                    >
                      <FaUniversity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {bankData ? "Edit Bank" : "Add Bank"}
                      </span>
                    </Link>
                    <Link
                      to="/dashboard/document-upload"
                      className={`bg-white rounded-xl shadow-sm p-4 border hover:shadow-md transition text-center ${
                        docStatus.isComplete ? 'border-green-300 bg-green-50' : 'border-gray-100'
                      }`}
                    >
                      <FaFileUpload className={`w-8 h-8 mx-auto mb-2 ${
                        docStatus.isComplete ? 'text-green-600' : 'text-orange-600'
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Upload Documents</span>
                      {docStatus.isComplete && (
                        <span className="text-xs text-green-600 block">✓ Complete</span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;