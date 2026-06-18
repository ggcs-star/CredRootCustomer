import React, {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  createCompanyDetails,
  getEntityTypes,
} from "../../../api";

const Company = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [entityTypes, setEntityTypes] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-black">
          Company Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
          <Input
            label="Company Name"
            name="company_name"
            value={
              formData.company_name
            }
            onChange={
              handleChange
            }
            required
          />

          {/* Entity Type */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Entity Type
            </label>

            <select
              name="entity_type"
              value={
                formData.entity_type
              }
              onChange={
                handleChange
              }
              required
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
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
              Industry Type
            </label>

            <select
              name="industry_type"
              value={
                formData.industry_type
              }
              onChange={
                handleChange
              }
              required
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
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

          <Input
            label="Company PAN"
            name="pan_number"
            value={
              formData.pan_number
            }
            onChange={
              handleChange
            }
            required
          />

          <Input
            label="Monthly Revenue"
            name="monthly_revenue"
            type="number"
            value={
              formData.monthly_revenue
            }
            onChange={
              handleChange
            }
            required
          />

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={
              handleChange
            }
            required
          />

          <Input
            label="State"
            name="state"
            value={
              formData.state
            }
            onChange={
              handleChange
            }
            required
          />

          <div className="md:col-span-2 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">
                Company Members
              </h2>

              <button
                type="button"
                onClick={addMember}
                className="bg-black text-white px-4 py-2 rounded-lg"
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
                  className="border rounded-xl p-4 mb-4"
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
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      name="name"
                      value={
                        member.name
                      }
                      onChange={(
                        e
                      ) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
                      required
                    />

                    <Input
                      label="Designation"
                      name="designation"
                      value={
                        member.designation
                      }
                      onChange={(
                        e
                      ) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
                      required
                    />

                    <Input
                      label="PAN Number"
                      name="pan_number"
                      value={
                        member.pan_number
                      }
                      onChange={(
                        e
                      ) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
                      required
                    />

                    <Input
                      label="Mobile"
                      name="mobile"
                      value={
                        member.mobile
                      }
                      onChange={(
                        e
                      ) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
                      required
                    />

                    <Input
                      label="Ownership %"
                      name="ownership_percentage"
                      type="number"
                      value={
                        member.ownership_percentage
                      }
                      onChange={(
                        e
                      ) =>
                        handleMemberChange(
                          index,
                          e
                        )
                      }
                      required
                    />
                  </div>
                </div>
              )
            )}
          </div>

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

const Input = ({
  label,
  ...props
}) => (
  <div>
    <label className="block mb-2 text-gray-700 font-medium">
      {label}
    </label>

    <input
      {...props}
      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
    />
  </div>
);

export default Company;