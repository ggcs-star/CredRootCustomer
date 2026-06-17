import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../api";

const Profile = () => {
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

    try {
      setLoading(true);

      const response =
        await updateUserProfile(formData);

      alert(
        response?.data?.message ||
          "Profile Updated Successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
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
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Update your personal information.
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

              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                autoComplete="off"
                className="
                  w-full
                  bg-white
                  text-black
                  border-2
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  placeholder-gray-400
                  outline-none
                  transition-all
                  duration-200
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
                style={{
                  color: "#000",
                  WebkitTextFillColor: "#000",
                }}
              />
            </div>
          ))}

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-blue-600
                text-white
                py-3
                rounded-xl
                font-semibold
                hover:bg-blue-700
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Updating..."
                : "Update Profile"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;