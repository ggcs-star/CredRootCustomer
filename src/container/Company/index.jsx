import React, {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import StepperWrapper from "../../routes/MainRoutes/Stepper/components/StepperWrapper";
import {
  createCompanyDetails,
  getEntityTypes,
} from "../../../api";

const Company = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [entityTypes, setEntityTypes] = useState([]);

  // Define steps for the stepper
  const steps = [
    { id: 1, label: 'Personal Details', description: 'Your information', path: '/profile' },
    { id: 2, label: 'Company Details', description: 'Business info', path: '/company' },
    { id: 3, label: 'Bank Details', description: 'Bank account', path: '/company-banks' },
    { id: 4, label: 'Loan Application', description: 'Apply for loan', path: '/loan-application' },
    { id: 5, label: 'Document Upload', description: 'Upload documents', path: '/document-upload' }
  ];

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

  useEffect(() => {
    fetchEntityTypes();
  }, []);

  const fetchEntityTypes = async () => {
    try {
      const response =
        await getEntityTypes();

      setEntityTypes(
        response?.data?.data || []
      );
    } catch (error) {
      console.error(
        "Entity Types Error:",
        error
      );
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleMemberChange = (
    index,
    e
  ) => {
    const updatedMembers = [
      ...formData.members,
    ];

    updatedMembers[index][
      e.target.name
    ] = e.target.value;

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
    if (
      formData.members.length === 1
    )
      return;

    const updatedMembers =
      formData.members.filter(
        (_, i) => i !== index
      );

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

      console.log(
        "Company Payload:",
        formData
      );

      const response =
        await createCompanyDetails(
          formData
        );

      console.log(
        "Company Response:",
        response.data
      );

      alert(
        response?.data?.message ||
          "Company Added Successfully"
      );

      const companyId =
        response?.data?.data?.id ||
        response?.data?.company?.id ||
        response?.data?.id;

      if (companyId) {
        localStorage.setItem(
          "company_id",
          companyId
        );
      }

      navigate("/company-banks");
    } catch (error) {
      console.error(
        "Company Create Error:",
        error
      );

      alert(
        error?.response?.data
          ?.message ||
          "Failed To Save Company"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (index, step) => {
    // Allow navigation to previous steps
    if (index <= 1) {
      if (step.path) {
        navigate(step.path);
      }
    }
  };

  return (
    <StepperWrapper
      steps={steps}
      currentStep={1}
      onStepClick={handleStepClick}
      title="Company Details"
      subtitle="Enter your company information"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
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

          {/* Entity Type */}
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
              <option value="">
                Select Entity Type
              </option>

              {entityTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Industry Type */}
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
              <option value="">
                Select Industry
              </option>

              <option value="Manufacturing">
                Manufacturing
              </option>

              <option value="Service">
                Service
              </option>

              <option value="Trading">
                Trading
              </option>

              <option value="Retail">
                Retail
              </option>

              <option value="IT">
                IT
              </option>
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

          {formData.members.map(
            (
              member,
              index
            ) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-black">
                    Member{" "}
                    {index + 1}
                  </h3>

                  {formData.members
                    .length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeMember(
                          index
                        )
                      }
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
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
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
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
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
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
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
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
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
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
                      required
                      placeholder="Enter ownership %"
                      min="0"
                      max="100"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
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

export default Company;