import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
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

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
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

      const profile = response?.data?.data?.profile || {};

      const data = {
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

      setFormData(data);
      setOriginalData(data);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      console.log("Profile Error Response:", error?.response?.data);
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
      !formData.dob ||
      !formData.gender ||
      !formData.aadhaar_number ||
      !formData.pan_number ||
      !formData.occupation
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      console.log("Submitting Profile:", formData);

      const response = await updateUserProfile(formData);

      console.log("Profile Update Response:", response.data);

      alert(
        response?.data?.message ||
          "Profile Updated Successfully"
      );

      setOriginalData(formData);
      setIsEditing(false);
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Profile Update Error:", error);
      console.log("Update Error Response:", error?.response?.data);

      alert(
        error?.response?.data?.message ||
          "Failed To Update Profile"
      );
    } finally {
      setLoading(false);
    }
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
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const fields = [
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
      required: true,
      displayValue: (value) => value || "N/A",
    },
    {
      name: "pan_number",
      label: "PAN Number",
      required: true,
      displayValue: (value) => value || "N/A",
    },
    {
      name: "occupation",
      label: "Occupation",
      required: true,
      displayValue: (value) => value || "N/A",
    },
    {
      name: "address",
      label: "Address",
      required: false,
      displayValue: (value) => value || "Not provided",
    },
    {
      name: "city",
      label: "City",
      required: false,
      displayValue: (value) => value || "Not provided",
    },
    {
      name: "state",
      label: "State",
      required: false,
      displayValue: (value) => value || "Not provided",
    },
    {
      name: "pincode",
      label: "Pincode",
      required: false,
      displayValue: (value) => value || "Not provided",
    },
  ];

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
              className={field.name === "address" ? "md:col-span-2" : ""}
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
                  placeholder={`Enter ${field.label}`}
                  autoComplete="off"
                  required={field.required}
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
    </div>
  );
};

export default DashboardProfile;