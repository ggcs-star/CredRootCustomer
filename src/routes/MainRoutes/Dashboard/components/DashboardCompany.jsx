import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCompanyDetails,
  getCompanyDetails,
  updateCompanyDetails,
  deleteCompany,
  getEntityTypes,
} from "../../../../../api";

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
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
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
                  {[1, 2, 3, 4, 5].map((subItem) => (
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

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [entityTypes, setEntityTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    entity_type: "",
    industry_type: "",
    pan_number: "",
    monthly_revenue: "",
    city: "",
    state: "",
    members: [
      {
        name: "",
        designation: "",
        pan_number: "",
        mobile: "",
        ownership_percentage: "",
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
      
      // Handle the response structure - data is an array of companies
      const companiesData = response?.data?.data || [];
      setCompanies(companiesData);
      
      if (companiesData.length > 0) {
        // Don't auto-select, let user choose which to edit
        setIsEditing(false);
      } else {
        // No companies found, show empty form for new company
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Fetch Companies Data Error:", error);
      // If no companies exist, show empty form
      setIsEditing(true);
    }
  };

  const loadCompanyData = (companyData) => {
    setSelectedCompanyId(companyData.id);
    
    const formattedData = {
      company_name: companyData.company_name || "",
      entity_type: companyData.entity_type || "",
      industry_type: companyData.industry_type || "",
      pan_number: companyData.pan_number || "",
      monthly_revenue: companyData.monthly_revenue || "",
      city: companyData.city || "",
      state: companyData.state || "",
      members: companyData.members && companyData.members.length > 0 
        ? companyData.members.map(member => ({
            name: member.name || "",
            designation: member.designation || "",
            pan_number: member.pan_number || "",
            mobile: member.mobile || "",
            ownership_percentage: member.ownership_percentage || "",
          }))
        : [
            {
              name: "",
              designation: "",
              pan_number: "",
              mobile: "",
              ownership_percentage: "",
            },
          ],
    };
    
    setFormData(formattedData);
    setOriginalData(formattedData);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMemberChange = (index, e) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][e.target.name] = e.target.value;

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
          mobile: "",
          ownership_percentage: "",
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

    // Validate required fields
    if (!formData.company_name || !formData.entity_type || 
        !formData.industry_type || !formData.pan_number || 
        !formData.monthly_revenue || !formData.city || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate members
    for (let member of formData.members) {
      if (!member.name || !member.designation || !member.pan_number || 
          !member.mobile || !member.ownership_percentage) {
        alert('Please fill in all member details');
        return;
      }
    }

    try {
      setLoading(true);

      let response;
      if (selectedCompanyId) {
        // Update existing company
        response = await updateCompanyDetails(selectedCompanyId, formData);
      } else {
        // Create new company
        response = await createCompanyDetails(formData);
      }

      console.log("Company Response:", response.data);

      const newCompanyId = response?.data?.data?.company?.id || 
                          response?.data?.data?.id || 
                          response?.data?.id;

      if (newCompanyId) {
        localStorage.setItem("company_id", newCompanyId);
      }

      // Refresh companies list
      await fetchCompaniesData();
      
      // Reset form
      setSelectedCompanyId(null);
      setFormData({
        company_name: "",
        entity_type: "",
        industry_type: "",
        pan_number: "",
        monthly_revenue: "",
        city: "",
        state: "",
        members: [
          {
            name: "",
            designation: "",
            pan_number: "",
            mobile: "",
            ownership_percentage: "",
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

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setSelectedCompanyId(null);
  };

  const handleAddNew = () => {
    setSelectedCompanyId(null);
    setFormData({
      company_name: "",
      entity_type: "",
      industry_type: "",
      pan_number: "",
      monthly_revenue: "",
      city: "",
      state: "",
      members: [
        {
          name: "",
          designation: "",
          pan_number: "",
          mobile: "",
          ownership_percentage: "",
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
    } catch (error) {
      console.error("Delete Company Error:", error);
      alert(error?.response?.data?.message || 'Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

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
          {companies.map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="space-y-4">
                {/* Company Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{company.company_name}</h3>
                    <p className="text-sm text-gray-500">ID: #{company.id}</p>
                  </div>
                  <div className="flex gap-2">
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

                {/* Company Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
                    <label className="block text-sm font-medium text-gray-500">Monthly Revenue</label>
                    <div className="text-gray-900 font-medium">
                      {company.monthly_revenue ? `₹${parseFloat(company.monthly_revenue).toLocaleString()}` : "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <div className="text-gray-900 font-medium">{company.city || "Not provided"}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <div className="text-gray-900 font-medium">{company.state || "Not provided"}</div>
                  </div>
                </div>

                {/* Members Section */}
                {company.members && company.members.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Members ({company.members.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.members.map((member, index) => (
                        <div key={member.id || index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Name</label>
                              <div className="text-gray-900 font-medium text-sm">{member.name || "N/A"}</div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Designation</label>
                              <div className="text-gray-900 font-medium text-sm">{member.designation || "N/A"}</div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">PAN</label>
                              <div className="text-gray-900 font-medium text-sm">{member.pan_number || "N/A"}</div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Ownership %</label>
                              <div className="text-gray-900 font-medium text-sm">{member.ownership_percentage || "N/A"}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              </select>
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
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
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