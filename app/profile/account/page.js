"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AccountSettings() {
  const supabase = createClientComponentClient();
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    alternatePhone: "",
    address: "123 Main Street, Mumbai",
    profileImage: null,
    vehicleType: "Two Wheeler",
    vehicleNumber: "MH 01 AB 1234",
    vehicleModel: "Honda Activa",
    vehicleYear: "2022",
    licenseNumber: "MH1234567890",
    licenseExpiry: "2025-12-31",
    insuranceNumber: "INS123456",
    insuranceExpiry: "2024-12-31",
    bankName: "HDFC Bank",
    accountNumber: "XXXX XXXX XXXX 1234",
    ifscCode: "ABCD0001234",
    upiId: "john@upi",
    panNumber: "ABCDE1234F",
    aadharNumber: "XXXX XXXX XXXX 5678",
  });

  // Add loading state
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            fullName: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            alternatePhone: data.alternate_phone || "",
            address: data.address || "",
            profileImage: data.photo || null,
            vehicleType: data.vehicle_type || "",
            vehicleNumber: data.vehicle_number || "",
            vehicleModel: data.vehicle_model || "",
            vehicleYear: data.vehicle_year || "",
            licenseNumber: data.driving_license || "",
            licenseExpiry: data.license_expiry || "",
            insuranceNumber: data.insurance_number || "",
            insuranceExpiry: data.insurance_expiry || "",
            bankName: data.bank_name || "",
            accountNumber: data.bank_account_no || "",
            ifscCode: data.bank_ifsc_code || "",
            upiId: data.upi_id || "",
            panNumber: data.pan_card_number || "",
            aadharNumber: data.aadhar_no || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [supabase]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("users")
        .update({ photo: filePath })
        .eq("auth_id", user.id);

      if (updateError) throw updateError;

      setFormData((prev) => ({ ...prev, profileImage: filePath }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Create update object
      const updateData = {
        full_name: formData.fullName,
        phone: formData.phone,
        alternate_phone: formData.alternatePhone,
        address: formData.address,
        vehicle_type: formData.vehicleType,
        vehicle_number: formData.vehicleNumber,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        driving_license: formData.licenseNumber,
        insurance_number: formData.insuranceNumber,
        bank_name: formData.bankName,
        bank_account_no: formData.accountNumber,
        bank_ifsc_code: formData.ifscCode,
        upi_id: formData.upiId,
        pan_card_number: formData.panNumber,
        aadhar_no: formData.aadharNumber,
        // Only include date fields if they have a value
        ...(formData.licenseExpiry
          ? { license_expiry: formData.licenseExpiry }
          : {}),
        ...(formData.insuranceExpiry
          ? { insurance_expiry: formData.insuranceExpiry }
          : {}),
      };

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("auth_id", user.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const sections = [
    { id: "personal", label: "Personal Information" },
    { id: "vehicle", label: "Vehicle Information" },
    { id: "documents", label: "Documents" },
    { id: "bank", label: "Bank Details" },
    { id: "preferences", label: "Preferences" },
  ];

  // Add loading state to return
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        {/* <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg ${
            isEditing ? "bg-gray-200 text-gray-600" : "bg-blue-500 text-white"
          }`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button> */}
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{formData.fullName}</h2>
            <p className="text-gray-600">ID: DRV123456</p>
            <p className="text-sm text-gray-500">Member since March 2024</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeSection === section.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div
          className={`bg-white rounded-lg shadow mb-4 ${
            activeSection === "personal" ? "" : "hidden"
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div
          className={`bg-white rounded-lg shadow mb-4 ${
            activeSection === "vehicle" ? "" : "hidden"
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Vehicle Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                >
                  <option>Two Wheeler</option>
                  <option>Three Wheeler</option>
                  <option>Four Wheeler</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Year
                </label>
                <input
                  type="text"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div
          className={`bg-white rounded-lg shadow mb-4 ${
            activeSection === "documents" ? "" : "hidden"
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Documents</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Number
                </label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div
          className={`bg-white rounded-lg shadow mb-4 ${
            activeSection === "bank" ? "" : "hidden"
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Bank Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-100 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
