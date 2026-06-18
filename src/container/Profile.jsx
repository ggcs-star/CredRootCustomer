import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Complete Your Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Please fill in your details to continue.
          </p>
        </div>

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
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full bg-white text-black border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                  className="w-full bg-white text-black border-2 border-gray-300 rounded-xl px-4 py-3 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;