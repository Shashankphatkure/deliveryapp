"use client";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = [
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
    id: "picked_up",
    label: "Picked Up",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
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
    id: "delivered",
    label: "Delivered",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    ),
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

const getStatusStyle = (status) => {
  const styles = {
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
    delivered: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Delivered",
    },
  };
  return styles[status] || styles.accepted;
};

export default function OrderDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [otherMethod, setOtherMethod] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [photoProof, setPhotoProof] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("accepted");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleDeliverySubmit = () => {
    // Handle delivery completion logic here
    console.log({
      deliveryMethod,
      otherMethod,
      photoProof,
    });
    setShowDeliveryModal(false);
  };

  const handleCancellation = () => {
    // Handle cancellation logic here
    console.log({ cancelReason });
    setShowCancelModal(false);
  };

  const handleSupportSubmit = () => {
    // Handle support contact logic here
    setShowSupportModal(false);
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    // Here you would typically make an API call to update the status
    console.log(`Status updated to: ${newStatus}`);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const StatusSelector = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="font-semibold mb-4">Order Status</h2>
      <div
        className="flex space-x-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {ORDER_STATUSES.map((status, index) => {
          const isActive = currentStatus === status.id;
          const isPast =
            ORDER_STATUSES.findIndex((s) => s.id === currentStatus) >
            ORDER_STATUSES.findIndex((s) => s.id === status.id);

          return (
            <div
              key={status.id}
              className={`flex-shrink-0 relative ${
                index < ORDER_STATUSES.length - 1
                  ? 'after:content-[""] after:absolute after:top-1/2 after:right-[-1rem] after:w-4 after:h-0.5 after:bg-gray-200'
                  : ""
              }`}
            >
              <button
                onClick={() => handleStatusChange(status.id)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
                  isActive
                    ? status.bgColor
                    : isPast
                    ? "bg-gray-100"
                    : "bg-white"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? `${status.color} border-current`
                      : isPast
                      ? "border-gray-400 text-gray-400"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {status.icon}
                  </svg>
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? status.color
                      : isPast
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {status.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()} className="mr-2">
          <svg
            className="w-6 h-6 text-gray-600"
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
        <h1 className="text-2xl font-bold">Order #{id}</h1>
      </div>

      {/* Timer and Status Bar */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-600">Time Remaining</p>
            <p className="text-2xl font-bold text-blue-800">15:00</p>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              In Progress
            </span>
          </div>
        </div>
      </div>

      <StatusSelector />

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-lg font-bold">₹950.00</span>
            <p className="text-sm text-gray-500">Cash on Delivery</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Order Time</p>
            <p className="font-medium">2:30 PM</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                getStatusStyle(currentStatus).bg
              } ${getStatusStyle(currentStatus).text}`}
            >
              {getStatusStyle(currentStatus).label}
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {ORDER_STATUSES.map((status, index) => {
              const isActive = currentStatus === status.id;
              const isPast =
                ORDER_STATUSES.findIndex((s) => s.id === currentStatus) >
                ORDER_STATUSES.findIndex((s) => s.id === status.id);

              return (
                <div
                  key={status.id}
                  className="flex items-center cursor-pointer"
                  onClick={() => handleStatusChange(status.id)}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive
                        ? status.bgColor
                        : isPast
                        ? "bg-gray-100"
                        : "bg-gray-50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isActive
                          ? status.color
                          : isPast
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {status.icon}
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? status.color
                          : isPast
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {status.label}
                    </p>
                    {isActive && (
                      <p className="text-xs text-gray-500">Current Status</p>
                    )}
                  </div>
                  {isActive && (
                    <div className={`flex-shrink-0 ${status.color}`}>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center text-sm mt-4">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
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
            <span>Expected delivery by 3:00 PM</span>
          </div>
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
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
            <span>3.5 km total distance</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-3">Order Items</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">2x Large Pizza</p>
              <p className="text-sm text-gray-500">Extra cheese, Mushrooms</p>
            </div>
            <span className="text-gray-600">₹600</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">1x Garlic Bread</p>
              <p className="text-sm text-gray-500">With cheese dip</p>
            </div>
            <span className="text-gray-600">₹150</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total Items: 3</span>
            <span>₹750</span>
          </div>
        </div>
      </div>

      {/* Delivery Locations */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
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
                  <p className="font-medium">Pizza Hub</p>
                  <p className="text-sm text-gray-600">
                    123 Restaurant Street, Mumbai
                  </p>
                </div>
                <button className="text-blue-600 text-sm">Navigate</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Contact: +91 98765 43210
              </p>
            </div>
          </div>

          {/* Dotted Line */}
          <div className="ml-4 border-l-2 border-dashed h-8 border-gray-200"></div>

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
                  <p className="font-medium">Customer Location</p>
                  <p className="text-sm text-gray-600">
                    456 Customer Avenue, Mumbai
                  </p>
                </div>
                <button className="text-blue-600 text-sm">Navigate</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Contact: +91 98765 43211
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-2">Delivery Instructions</h2>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please deliver to the security gate. Call when reached.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setShowDeliveryModal(true)}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
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
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
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
        <button
          onClick={() => setShowSupportModal(true)}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center"
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

      {/* Delivery Completion Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                Upload Delivery Photo Proof
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setPhotoProof(e.target.files[0])}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeliverySubmit}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
              >
                Complete Delivery
              </button>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="flex-1 bg-gray-100 py-2 rounded-lg"
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
