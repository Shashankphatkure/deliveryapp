"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ORDER_STATUSES = [
  {
    id: "confirmed",
    label: "Confirmed",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    id: "accepted",
    label: "Accepted",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    ),
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },

  {
    id: "on_way",
    label: "On The Way",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "reached",
    label: "Reached",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
    ),
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

const getStatusStyle = (status) => {
  const styles = {
    confirmed: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      label: "Confirmed",
    },
    accepted: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Accepted",
    },
    picked_up: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Picked Up",
    },
    on_way: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      label: "On The Way",
    },
    reached: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Reached",
    },
  };
  return styles[status] || styles.confirmed;
};

const StatusSelector = ({ currentStatus, handleStatusChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const statusOrder = {
    confirmed: ["accepted"],
    accepted: ["on_way"],
    on_way: ["reached"],
    reached: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const getEnabledStatuses = (currentStatus) => {
    return statusOrder[currentStatus] || [];
  };

  const enabledStatuses = getEnabledStatuses(currentStatus);

  return (
    <div
      className="flex overflow-x-auto pb-4 mb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex space-x-3 sm:space-x-4 w-full">
        {ORDER_STATUSES.map((status) => {
          const isEnabled = enabledStatuses.includes(status.id);
          const isCurrent = currentStatus === status.id;
          const isPast =
            getStatusIndex(currentStatus) > getStatusIndex(status.id);

          return (
            <button
              key={status.id}
              onClick={() => isEnabled && handleStatusChange(status.id)}
              disabled={!isEnabled}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
                isCurrent
                  ? `${status.bgColor} ${status.color}`
                  : isPast
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : isEnabled
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {status.icon}
              </svg>
              <span>{status.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const getStatusIndex = (status) => {
  const orderSequence = [
    "confirmed",
    "accepted",
    "on_way",
    "reached",
    "delivered",
  ];
  return orderSequence.indexOf(status);
};

const openGoogleMapsNavigation = (destination) => {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const origin = `${latitude},${longitude}`;
      // Create Google Maps URL with origin and destination
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(
        destination
      )}`;
      // Open in new tab
      window.open(url, "_blank");
    },
    (error) => {
      console.error("Error getting location:", error);
      // Fallback: Open navigation without current location
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination
      )}`;
      window.open(url, "_blank");
    }
  );
};

export default function OrderDetails({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [otherMethod, setOtherMethod] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [photoProof, setPhotoProof] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // First get the user's record from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (userError) throw userError;
      if (!userData) {
        console.error("No user record found");
        return;
      }

      // Fetch the specific order with correct column names
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          driver:users!fk_orders_driver (
            full_name,
            phone,
            vehicle_number,
            vehicle_type
          ),
          store:stores (
            name,
            address,
            phone
          ),
          customer:customers (
            full_name,
            phone,
            address,
            homeaddress,
            workaddress
          )
        `
        )
        .eq("id", id)
        .eq("driverid", userData.id)
        .single();

      if (error) throw error;

      console.log("Order status from DB:", data.status);

      setOrder(data);
      setCurrentStatus(data.status);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setCurrentStatus(newStatus);
      // Refresh order data
      fetchOrder();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeliverySubmit = async () => {
    try {
      if (!deliveryMethod) {
        alert("Please select a delivery method");
        return;
      }

      if (!photoProof) {
        alert("Please upload a delivery photo proof");
        return;
      }

      // Start with the basic update data
      const updateData = {
        status: "delivered",
        completiontime: new Date().toISOString(),
        remark: deliveryMethod === "other" ? otherMethod : deliveryMethod,
      };

      // If there's a photo, upload it first
      if (photoProof) {
        const fileExt = photoProof.name.split(".").pop();
        const fileName = `${id}-${Math.random()}.${fileExt}`;
        const filePath = `delivery-proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("delivery-proofs")
          .upload(filePath, photoProof);

        if (uploadError) throw uploadError;

        // Add the photo URL to the update data
        updateData.photo_proof = filePath;
      }

      // Update the order
      const { error: updateError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);

      if (updateError) throw updateError;

      // Update local state
      setCurrentStatus("delivered");
      setShowDeliveryModal(false);

      // Reset form
      setDeliveryMethod("");
      setOtherMethod("");
      setPhotoProof(null);

      // Refresh order data
      fetchOrder();

      // Show success message
      alert("Delivery completed successfully!");
    } catch (error) {
      console.error("Error completing delivery:", error);
      alert("Failed to complete delivery. Please try again.");
    }
  };

  const handleCancellation = async () => {
    try {
      if (!cancelReason) {
        alert("Please select a cancellation reason");
        return;
      }

      const { error } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
          remark: cancelReason,
        })
        .eq("id", id);

      if (error) throw error;

      setCurrentStatus("cancelled");
      setShowCancelModal(false);
      setCancelReason("");

      // Refresh order data
      fetchOrder();

      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Order not found</h1>
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button onClick={() => router.back()} className="mr-2">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">Order #{order.id}</h1>
      </div>

      {/* Only show status-related components if order is not cancelled */}
      {currentStatus !== "cancelled" && (
        <>
          {/* Accept Order Box */}
          {currentStatus === "confirmed" && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4 animate-pulse">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-blue-900">
                    New Order Available!
                  </h3>
                  <p className="text-blue-700">
                    Quick action needed - Accept to start delivery
                  </p>
                </div>
                <button
                  onClick={() => handleStatusChange("accepted")}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-base flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Accept Order
                </button>
              </div>
            </div>
          )}

          {currentStatus === "on_way" && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4 animate-pulse">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-purple-900">
                    Arrived at Destination?
                  </h3>
                  <p className="text-purple-700">
                    Quick action needed - Mark as reached to deliver
                  </p>
                </div>
                <button
                  onClick={() => handleStatusChange("reached")}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-base flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  Reached
                </button>
              </div>
            </div>
          )}

          {/* Timer and Status Bar */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm text-blue-600">Order Time</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-800">
                  {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusStyle(currentStatus).bg
                  } ${getStatusStyle(currentStatus).text}`}
                >
                  {getStatusStyle(currentStatus).label}
                </span>
              </div>
            </div>
          </div>

          <StatusSelector
            currentStatus={currentStatus}
            handleStatusChange={handleStatusChange}
          />
        </>
      )}

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-base sm:text-lg font-bold">
              ₹{order.total_amount}
            </span>
            <p className="text-xs sm:text-sm text-gray-500">
              {order.payment_method}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Payment Status</p>
            <p className="font-medium capitalize">{order.payment_status}</p>
          </div>
        </div>
      </div>

      {/* Delivery Locations */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
        <h2 className="font-semibold mb-4">Delivery Route</h2>
        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="flex">
            <div className="mr-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {order.store?.name || "Pickup Location"}
                  </p>
                  <p className="text-sm text-gray-600">{order.start}</p>
                </div>
                <button
                  onClick={() => openGoogleMapsNavigation(order.start)}
                  className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Navigate
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Contact: {order.store?.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* Dotted Line with Distance and Time */}
          <div className="flex">
            <div className="ml-4 border-l-2 border-dashed h-8 border-gray-200"></div>
            <div className="flex-1 ml-3 -mt-2">
              {(order.distance || order.time) && (
                <div className="bg-gray-50 rounded-lg p-2 inline-block">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    {order.distance && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        {order.distance}
                      </div>
                    )}
                    {order.distance && order.time && (
                      <span className="text-gray-300">•</span>
                    )}
                    {order.time && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {order.time}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drop Location */}
          <div className="flex">
            <div className="mr-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {order.customer?.full_name || "Customer"}
                  </p>
                  <p className="text-sm text-gray-600">{order.destination}</p>
                </div>
                <button
                  onClick={() => openGoogleMapsNavigation(order.destination)}
                  className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Navigate
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Contact: {order.customer?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      {order.delivery_notes && (
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
          <h2 className="font-semibold mb-2">Delivery Instructions</h2>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">{order.delivery_notes}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 sm:space-y-3 fixed bottom-0 left-0 right-0 p-4 bg-white border-t sm:relative sm:border-0 sm:bg-transparent">
        {currentStatus === "reached" && (
          <button
            onClick={() => setShowDeliveryModal(true)}
            className="w-full bg-green-500 text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Mark as Delivered
          </button>
        )}
        {currentStatus !== "cancelled" && currentStatus !== "delivered" && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full bg-red-500 text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel Order
          </button>
        )}
        <button
          onClick={() => setShowSupportModal(true)}
          className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Contact Support
        </button>
      </div>

      {/* Add bottom padding to account for fixed buttons on mobile */}
      <div className="h-48 sm:h-0"></div>

      {/* Delivery Completion Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-lg sm:rounded-lg p-4 sm:p-6 w-full max-h-[90vh] overflow-y-auto sm:max-w-md mx-0 sm:mx-4">
            <h3 className="text-lg font-semibold mb-4">Complete Delivery</h3>

            {/* Delivery Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How was the order delivered?
              </label>
              <select
                className="w-full p-2 border rounded-lg mb-2"
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option value="">Select delivery method</option>
                <option value="handed">Handed to customer</option>
                <option value="door">Left at door</option>
                <option value="other">Other</option>
              </select>

              {deliveryMethod === "other" && (
                <input
                  type="text"
                  placeholder="Please specify"
                  className="w-full p-2 border rounded-lg"
                  value={otherMethod}
                  onChange={(e) => setOtherMethod(e.target.value)}
                />
              )}
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Delivery Photo Proof{" "}
                <span className="text-red-500">*</span>
              </label>
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg 
                ${!photoProof ? 'border-gray-300' : 'border-green-500'}"
              >
                <div className="space-y-1 text-center">
                  {photoProof ? (
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-gray-600">{photoProof.name}</p>
                      <button
                        onClick={() => setPhotoProof(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex flex-col space-y-2">
                        {/* Camera button - will open camera on mobile */}
                        <label
                          htmlFor="camera-capture"
                          className="relative cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Take Photo</span>
                          <input
                            id="camera-capture"
                            name="camera-capture"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File size must be less than 5MB");
                                  e.target.value = null;
                                  return;
                                }
                                if (!file.type.startsWith("image/")) {
                                  alert("Please upload an image file");
                                  e.target.value = null;
                                  return;
                                }
                                setPhotoProof(file);
                              }
                            }}
                            required
                          />
                        </label>

                        {/* Regular file upload button */}
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer text-blue-600 hover:text-blue-500"
                        >
                          <span>or choose existing photo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File size must be less than 5MB");
                                  e.target.value = null;
                                  return;
                                }
                                if (!file.type.startsWith("image/")) {
                                  alert("Please upload an image file");
                                  e.target.value = null;
                                  return;
                                }
                                setPhotoProof(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              {!photoProof && (
                <p className="mt-1 text-sm text-red-500">
                  Photo proof is required to complete delivery
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeliverySubmit}
                disabled={!deliveryMethod || !photoProof}
                className={`flex-1 py-2 rounded-lg ${
                  !deliveryMethod || !photoProof
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                Complete Delivery
              </button>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select cancellation reason
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="customer_unavailable">
                  Customer unavailable
                </option>
                <option value="wrong_address">Wrong address</option>
                <option value="restaurant_closed">Restaurant closed</option>
                <option value="vehicle_breakdown">Vehicle breakdown</option>
                <option value="other">Other reason</option>
              </select>

              {cancelReason === "other" && (
                <textarea
                  placeholder="Please specify the reason"
                  className="w-full p-2 border rounded-lg mt-2"
                  rows="3"
                ></textarea>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancellation}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Cancel Order
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 py-2 rounded-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Contact Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Contact Support</h3>

            <div className="space-y-4 mb-6">
              <button className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white p-4 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Call Support</span>
              </button>

              <button className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white p-4 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Chat with Support</span>
              </button>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full bg-gray-100 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
