import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepperWrapper from "../routes/MainRoutes/Stepper/components/StepperWrapper";
import {
  getUserProfile,
  updateUserProfile,
} from "../../api";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  // Define steps for the stepper
  const steps = [
    { id: 1, label: 'Personal Details', description: 'Your information', path: '/profile' },
    { id: 2, label: 'Company Details', description: 'Business info', path: '/company' },
    { id: 3, label: 'Bank Details', description: 'Bank account', path: '/company-banks' },
    { id: 4, label: 'Loan Application', description: 'Apply for loan', path: '/loan-application' },
    { id: 5, label: 'Document Upload', description: 'Upload documents', path: '/document-upload' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();

      console.log("Profile Response:", response.data);

      const data =
        response?.data?.data ||
        response?.data ||
        {};

      setFormData({
        dob: data.dob || "",
        gender: data.gender || "",
        aadhaar_number: data.aadhaar_number || "",
        pan_number: data.pan_number || "",
        occupation: data.occupation || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      console.log(error?.response?.data);
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
    if (!formData.dob || !formData.gender || !formData.aadhaar_number || 
        !formData.pan_number || !formData.occupation) {
      alert('Please fill in all required fields');
      return;
    }

    console.log("Submitting Profile:", formData);

    try {
      setLoading(true);

      const response =
        await updateUserProfile(formData);

      console.log(
        "Profile Update Response:",
        response.data
      );

      alert(
        response?.data?.message ||
          "Profile Updated Successfully"
      );

      navigate("/company");
    } catch (error) {
      console.error(
        "Profile Update Error:",
        error
      );

      console.log(
        "Error Response:",
        error?.response
      );

      console.log(
        "Error Data:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          JSON.stringify(
            error?.response?.data
          ) ||
          "Failed To Update Profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (index, step) => {
    // Only allow navigation to previous steps or current step
    if (index <= 0) {
      // Stay on current step
    }
  };

  const fields = [
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
    },
    {
      name: "aadhaar_number",
      label: "Aadhaar Number",
    },
    {
      name: "pan_number",
      label: "PAN Number",
    },
    {
      name: "occupation",
      label: "Occupation",
    },
    {
      name: "address",
      label: "Address",
    },
    {
      name: "city",
      label: "City",
    },
    {
      name: "state",
      label: "State",
    },
    {
      name: "pincode",
      label: "Pincode",
    },
  ];

  return (
    <StepperWrapper
      steps={steps}
      currentStep={0}
      onStepClick={handleStepClick}
      title="Complete Your Profile"
      subtitle="Please fill in your details to continue"
    >
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              field.name === "address"
                ? "md:col-span-2"
                : ""
            }
          >
            <label className="block mb-2 font-medium text-gray-700">
              {field.label} <span className="text-red-500">*</span>
            </label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full bg-white text-black border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            ) : (
              <input
                type={
                  field.type || "text"
                }
                name={field.name}
                value={
                  formData[field.name]
                }
                onChange={
                  handleChange
                }
                placeholder={`Enter ${field.label}`}
                autoComplete="off"
                required={field.name !== 'address' && field.name !== 'city' && field.name !== 'state' && field.name !== 'pincode'}
                className="w-full bg-white text-black border-2 border-gray-300 rounded-xl px-4 py-3 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving..."
              : "Save & Continue →"}
          </button>
        </div>
      </form>
    </StepperWrapper>
  );
};

export default Profile;