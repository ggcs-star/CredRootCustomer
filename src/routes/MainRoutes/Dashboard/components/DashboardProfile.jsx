import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getUserProfile,
  updateUserProfile,
  uploadDocument,
  BASE_URL,
} from "../../../../../api";

// Shimmer Effect Component
const ProfileShimmer = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div key={item} className={item === 6 ? "md:col-span-2" : ""}>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            </div>
          ))}
          
          <div className="md:col-span-2 flex justify-end gap-4">
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef({});

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [personalDocuments, setPersonalDocuments] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    aadhaar_number: "",
    pan_number: "",
    occupation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);

      const response = await getUserProfile();
      console.log("Profile API Response:", response.data);

      const data = response?.data?.data || {};
      const user = data?.user || {};
      const profile = data?.profile || {};
      const documents = data?.personal_documents || null;

      setUserData(user);
      setProfileData(profile);
      setPersonalDocuments(documents);

      const formattedData = {
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
        aadhaar_number: profile.aadhaar_number || "",
        pan_number: profile.pan_number || "",
        occupation: profile.occupation || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.dob ||
      !formData.gender ||
      !formData.aadhaar_number ||
      !formData.pan_number ||
      !formData.occupation
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender,
        aadhaar_number: formData.aadhaar_number,
        pan_number: formData.pan_number,
        occupation: formData.occupation,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      console.log("Submitting Profile:", submitData);

      const response = await updateUserProfile(submitData);
      console.log("Profile Update Response:", response.data);

      toast.success(response?.data?.message || "Profile Updated Successfully");

      setOriginalData(formData);
      setIsEditing(false);
      await fetchProfile();
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error(error?.response?.data?.message || "Failed To Update Profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (documentId, file, side = 'front') => {
    if (!file) return;

    try {
      setUploadingId(documentId);

      const formData = new FormData();
      formData.append("document_master_id", documentId);
      formData.append("document_side", side);
      formData.append("file", file);

      console.log("Uploading document:", {
        documentId,
        side,
        fileName: file.name,
      });

      const response = await uploadDocument(formData);
      console.log("Upload Response:", response.data);

      toast.success(response?.data?.message || "Document uploaded successfully");

      // Refresh profile to update document status
      await fetchProfile();

    } catch (error) {
      console.error("Document Upload Error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingId(null);
    }
  };

  // Helper function to get full file URL
  const getFullFileUrl = (url) => {
    if (!url) return null;
    // If URL already starts with http, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise prepend the BASE_URL
    // Remove trailing slash from BASE_URL if it exists
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    // Remove 'api' from the end if it exists
    const baseWithoutApi = baseUrl.replace(/\/api$/, '');
    // Ensure url starts with /
    const filePath = url.startsWith('/') ? url : `/${url}`;
    return `${baseWithoutApi}${filePath}`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      displayValue: (value) => value || "N/A",
      placeholder: "Enter your full name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      displayValue: (value) => value || "N/A",
      placeholder: "Enter your email",
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "text",
      required: true,
      displayValue: (value) => value || "N/A",
      placeholder: "Enter 10-digit mobile number",
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      required: true,
      displayValue: (value) => formatDate(value),
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      displayValue: (value) => value || "N/A",
    },
    {
      name: "aadhaar_number",
      label: "Aadhaar Number",
      type: "text",
      required: true,
      displayValue: (value) => value || "N/A",
      placeholder: "Enter 12-digit Aadhaar number",
    },
    {
      name: "pan_number",
      label: "PAN Number",
      type: "text",
      required: true,
      displayValue: (value) => value || "N/A",
      placeholder: "Enter 10-digit PAN number",
    },
    {
      name: "occupation",
      label: "Occupation",
      type: "text",
      required: true,
      displayValue: (value) => value || "N/A",
      placeholder: "Enter your occupation",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: false,
      displayValue: (value) => value || "Not provided",
      placeholder: "Enter your address",
    },
    {
      name: "city",
      label: "City",
      type: "text",
      required: false,
      displayValue: (value) => value || "Not provided",
      placeholder: "Enter your city",
    },
    {
      name: "state",
      label: "State",
      type: "text",
      required: false,
      displayValue: (value) => value || "Not provided",
      placeholder: "Enter your state",
    },
    {
      name: "pincode",
      label: "Pincode",
      type: "text",
      required: false,
      displayValue: (value) => value || "Not provided",
      placeholder: "Enter 6-digit pincode",
    },
  ];

  // Render documents section
  const renderDocuments = () => {
    if (!personalDocuments) return null;

    const { is_kyc_complete, pending_mandatory_count, pending_documents, completed_documents } = personalDocuments;

    return (
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Documents
          </h3>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              is_kyc_complete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {is_kyc_complete ? '✓ KYC Complete' : `⏳ ${pending_mandatory_count} pending`}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                is_kyc_complete ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ 
                width: `${completed_documents.length + pending_documents.length > 0 
                  ? (completed_documents.length / (completed_documents.length + pending_documents.length)) * 100 
                  : 0}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{completed_documents.length} completed</span>
            <span>{pending_documents.length} pending</span>
          </div>
        </div>

        {/* Completed Documents */}
        {completed_documents.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-green-600 mb-2">Completed Documents</h4>
            <div className="space-y-2">
              {completed_documents.map((doc) => (
                <div key={doc.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.document_code}</p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">✓ Uploaded</span>
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
              ))}
            </div>
          </div>
        )}

        {/* Pending Documents */}
        {pending_documents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-600 mb-2">Pending Documents</h4>
            <div className="space-y-3">
              {pending_documents.map((doc) => {
                const isUploading = uploadingId === doc.id;
                const requiredSides = doc.sides_required === 0 ? ['single'] : 
                                     doc.sides_required === 1 ? ['front'] : 
                                     ['front', 'back'];
                const uploadedSides = doc.uploaded_sides || [];

                return (
                  <div key={doc.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.document_code}</p>
                        <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-gray-500">Formats: {doc.allowed_formats}</span>
                          <span className="text-xs text-gray-500">Max: {doc.max_size_kb} KB</span>
                          <span className="text-xs text-gray-500">
                            Sides: {requiredSides.join(', ')}
                          </span>
                        </div>
                      </div>
                      <span className="text-yellow-600 text-sm font-medium whitespace-nowrap ml-2">
                        ⏳ Pending
                      </span>
                    </div>

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
                                      handleDocumentUpload(doc.id, file, side);
                                    }
                                    e.target.value = '';
                                  }}
                                  className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                                {isUploading && (
                                  <span className="text-xs text-blue-600">Uploading...</span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (profileLoading) {
    return <ProfileShimmer />;
  }

  // Render Profile View (List View)
  if (!isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600 mt-1">View and manage your profile information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.name === "address" ? "md:col-span-2" : ""}
              >
                <label className="block mb-1 text-sm font-medium text-gray-500">
                  {field.label}
                </label>
                <div className="text-gray-900 font-medium py-1 border-b border-gray-200">
                  {field.displayValue(formData[field.name])}
                </div>
              </div>
            ))}

            <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        {renderDocuments()}
      </div>
    );
  }

  // Render Edit Form
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <p className="text-gray-600 mt-1">Update your profile information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div
              key={field.name}
              className={
                field.name === "address" || field.name === "name" || field.name === "email" 
                  ? "md:col-span-2" 
                  : ""
              }
            >
              <label className="block mb-2 font-medium text-gray-700">
                {field.label}
                {field.required && (
                  <span className="text-red-500"> *</span>
                )}
              </label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full bg-white text-black border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  autoComplete="off"
                  required={field.required}
                  maxLength={
                    field.name === "mobile" ? 10 :
                    field.name === "aadhaar_number" ? 12 :
                    field.name === "pan_number" ? 10 :
                    field.name === "pincode" ? 6 :
                    undefined
                  }
                  className="w-full bg-white text-black border-2 border-gray-300 rounded-xl px-4 py-3 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              )}
            </div>
          ))}

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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Documents Section in Edit Mode */}
      {renderDocuments()}
    </div>
  );
};

export default DashboardProfile;