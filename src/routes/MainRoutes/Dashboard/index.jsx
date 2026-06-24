import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
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
import { logoutUser, getUserProfile, getCompanyDetails, getCompanyBanks, getLoanApplication } from "../../../../api";

// Dashboard Shimmer Effect Component
const DashboardShimmer = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Shimmer */}
      <aside className="bg-white shadow-lg w-64 flex flex-col h-screen">
        {/* Logo Shimmer */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* User Profile Shimmer */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Menu Shimmer */}
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

        {/* Logout Button Shimmer */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Shimmer */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header Shimmer */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Stats Cards Shimmer */}
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

          {/* Detailed Information Shimmer */}
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

          {/* Quick Actions Shimmer */}
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
  const [companyData, setCompanyData] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [loanData, setLoanData] = useState(null);

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
        
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Fetch all data
        await Promise.all([
          fetchProfile(),
          fetchCompany(),
          fetchBank(),
          fetchLoan()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
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

  const fetchCompany = async () => {
    try {
      const response = await getCompanyDetails();
      setCompanyData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchBank = async () => {
    try {
      const response = await getCompanyBanks();
      setBankData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching bank:", error);
    }
  };

  const fetchLoan = async () => {
    try {
      const response = await getLoanApplication();
      setLoanData(response?.data?.data?.lead);
    } catch (error) {
      console.error("Error fetching loan:", error);
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
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <IoHome className="w-5 h-5" />, path: "/dashboard" },
    { id: "profile", label: "Profile", icon: <FaUserCircle className="w-5 h-5" />, path: "/dashboard/profile" },
    { id: "company", label: "Company", icon: <FaBuilding className="w-5 h-5" />, path: "/dashboard/company" },
    { id: "bank", label: "Bank Details", icon: <FaUniversity className="w-5 h-5" />, path: "/dashboard/company-banks" },
    { id: "loan", label: "Loan Application", icon: <FaFileAlt className="w-5 h-5" />, path: "/dashboard/loan-application" },
    { id: "documents", label: "Documents", icon: <FaFileUpload className="w-5 h-5" />, path: "/dashboard/document-upload" },
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

  // Check if we're on a nested route
  const isNestedRoute = location.pathname !== "/dashboard";

  // Show shimmer while loading
  if (loading) {
    return <DashboardShimmer />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col h-screen overflow-y-auto`}
      >
        {/* Logo */}
        {/* <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <h1 className={`text-2xl font-light tracking-tight ${!isSidebarOpen && "hidden"}`}>
              <span className="text-black">Cred</span>
              <span className="text-blue-500">Root</span>
            </h1>
            {!isSidebarOpen && (
              <h1 className="text-2xl font-light tracking-tight">
                <span className="text-blue-500">CR</span>
              </h1>
            )}
          </Link>
          
        </div> */}

        {/* User Profile in Sidebar */}
       <div className="p-4 border-b">
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

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
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

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <IoLogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {isNestedRoute ? (
            // Render nested routes using Outlet
            <Outlet />
          ) : (
            // Overview Content
            <>
              {/* Welcome Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name || "User"}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's an overview of your loan application status
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 truncate">
                        {companyData?.company_name || "Not Set"}
                      </p>
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
                        {loanData?.loan_amount ? `₹${parseFloat(loanData.loan_amount).toLocaleString()}` : "Not Applied"}
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
                        {loanData?.loan_type?.name || "Not Selected"}
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
                      <p className={`text-lg font-semibold mt-1 ${getStatusColor(loanData?.status?.name)}`}>
                        {loanData?.status?.name || "Not Started"}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      loanData?.status?.name === "New Application" ? "bg-blue-100" :
                      loanData?.status?.name === "Approved" ? "bg-green-100" :
                      loanData?.status?.name === "Rejected" ? "bg-red-100" :
                      "bg-gray-100"
                    }`}>
                      <span className={`${
                        loanData?.status?.name === "New Application" ? "text-blue-600" :
                        loanData?.status?.name === "Approved" ? "text-green-600" :
                        loanData?.status?.name === "Rejected" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {getStatusIcon(loanData?.status?.name)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Details */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaBuilding className="w-5 h-5 text-blue-600" />
                    Company Details
                  </h2>
                  {companyData ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Name</span>
                        <span className="font-medium text-gray-900">{companyData.company_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PAN Number</span>
                        <span className="font-medium text-gray-900">{companyData.pan_number || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entity Type</span>
                        <span className="font-medium text-gray-900">{companyData.entity_type || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Industry</span>
                        <span className="font-medium text-gray-900">{companyData.industry_type || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">City</span>
                        <span className="font-medium text-gray-900">{companyData.city || "N/A"}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No company details found</p>
                  )}
                  <Link
                    to="/dashboard/company"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit Company Details →
                  </Link>
                </div>

                {/* Bank Details */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUniversity className="w-5 h-5 text-green-600" />
                    Bank Details
                  </h2>
                  {bankData ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name</span>
                        <span className="font-medium text-gray-900">{bankData.bank_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Holder</span>
                        <span className="font-medium text-gray-900">{bankData.account_holder_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number</span>
                        <span className="font-medium text-gray-900">{bankData.account_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IFSC Code</span>
                        <span className="font-medium text-gray-900">{bankData.ifsc_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Type</span>
                        <span className="font-medium text-gray-900">{bankData.account_type}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No bank details found</p>
                  )}
                  <Link
                    to="/dashboard/company-banks"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit Bank Details →
                  </Link>
                </div>

                {/* Loan Application Details */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <IoDocumentText className="w-5 h-5 text-purple-600" />
                    Loan Application Details
                  </h2>
                  {loanData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Lead Number</span>
                          <span className="font-medium text-gray-900">{loanData.lead_number || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Loan Amount</span>
                          <span className="font-medium text-gray-900">₹{parseFloat(loanData.loan_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Loan Type</span>
                          <span className="font-medium text-gray-900">{loanData.loan_type?.name || "N/A"}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-medium ${getStatusColor(loanData.status?.name)}`}>
                            {loanData.status?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Created At</span>
                          <span className="font-medium text-gray-900">
                            {loanData.created_at ? new Date(loanData.created_at).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Bank</span>
                          <span className="font-medium text-gray-900">
                            {loanData.loan_applications?.[0]?.bank?.name || "N/A"}
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
                    {loanData ? "Update Loan Application →" : "Apply for Loan →"}
                  </Link>
                </div>

                {/* Quick Actions */}
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
                      <span className="text-sm font-medium text-gray-700">Company Details</span>
                    </Link>
                    <Link
                      to="/dashboard/company-banks"
                      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition text-center"
                    >
                      <FaUniversity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">Bank Details</span>
                    </Link>
                    <Link
                      to="/dashboard/document-upload"
                      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition text-center"
                    >
                      <FaFileUpload className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-700">Upload Documents</span>
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