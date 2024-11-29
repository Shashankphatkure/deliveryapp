"use client";
import Link from "next/link";
import { useState } from "react";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const ordersByStatus = {
    active: [
      {
        id: "1234",
        status: "In Progress",
        amount: "₹950.00",
        time: "30 mins",
        restaurant: "Pizza Hub",
        items: "2x Large Pizza, 1x Garlic Bread",
        distance: "3.5 km",
        customerName: "Rahul S.",
        paymentMode: "Online",
        estimatedTime: "15 mins",
        pickupArea: "Andheri West",
        dropArea: "Andheri East",
        orderType: "Food Delivery",
        priority: "High",
      },
      {
        id: "1235",
        status: "Picked Up",
        amount: "₹850.00",
        time: "25 mins",
        restaurant: "Burger King",
        items: "1x Combo Meal, 2x Fries",
        distance: "2.8 km",
        customerName: "Priya M.",
        paymentMode: "Cash",
        estimatedTime: "10 mins",
        pickupArea: "Bandra West",
        dropArea: "Bandra East",
        orderType: "Food Delivery",
        priority: "Medium",
      },
    ],
    completed: [
      {
        id: "1230",
        status: "Completed",
        amount: "₹750.00",
        date: "Today, 2:30 PM",
        restaurant: "Chinese Box",
        items: "3x Noodles Box",
        distance: "4.2 km",
        customerName: "Amit K.",
        paymentMode: "Online",
        completionTime: "35 mins",
        rating: 5,
        tip: "₹50",
        feedback: "Great service!",
      },
      {
        id: "1231",
        status: "Completed",
        amount: "₹1200.00",
        date: "Today, 1:15 PM",
        restaurant: "Biryani House",
        items: "2x Family Pack Biryani",
        distance: "5.0 km",
        customerName: "Sarah M.",
        paymentMode: "Online",
        completionTime: "40 mins",
        rating: 4,
        tip: "₹100",
        feedback: "Good delivery",
      },
    ],
    cancelled: [
      {
        id: "1228",
        status: "Cancelled",
        amount: "₹0.00",
        date: "Today, 3:45 PM",
        restaurant: "Subway",
        reason: "Customer unavailable",
        distance: "3.0 km",
        customerName: "Raj P.",
        paymentMode: "Online",
        cancellationTime: "After 10 mins",
        penalty: "No",
        notes: "Customer not responding",
      },
      {
        id: "1229",
        status: "Cancelled",
        amount: "₹0.00",
        date: "Yesterday",
        restaurant: "McDonald's",
        reason: "Restaurant closed",
        distance: "2.5 km",
        customerName: "Neha S.",
        paymentMode: "Online",
        cancellationTime: "Before pickup",
        penalty: "No",
        notes: "Restaurant closed early",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Picked Up":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "";
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-gray-600 text-sm">Today's Orders</p>
          <p className="text-xl font-bold">15</p>
          <p className="text-xs text-green-600">↑ 20% from yesterday</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-gray-600 text-sm">Completion Rate</p>
          <p className="text-xl font-bold">95%</p>
          <p className="text-xs text-green-600">↑ 5% this week</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-gray-600 text-sm">Avg. Time</p>
          <p className="text-xl font-bold">28 min</p>
          <p className="text-xs text-yellow-600">↔ Same as usual</p>
        </div>
      </div>

      {/* Order Tabs */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 px-4 rounded-lg ${
            activeTab === "active"
              ? "bg-white font-medium shadow"
              : "text-gray-600"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-2 px-4 rounded-lg ${
            activeTab === "completed"
              ? "bg-white font-medium shadow"
              : "text-gray-600"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`flex-1 py-2 px-4 rounded-lg ${
            activeTab === "cancelled"
              ? "bg-white font-medium shadow"
              : "text-gray-600"
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersByStatus[activeTab].map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  {order.priority && (
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded ${getPriorityBadge(
                        order.priority
                      )}`}
                    >
                      {order.priority} Priority
                    </span>
                  )}
                </div>
                <h3 className="font-medium mt-2">Order #{order.id}</h3>
                <p className="text-sm text-gray-600 mt-1">{order.restaurant}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{order.amount}</span>
                {order.tip && (
                  <p className="text-xs text-green-600">+{order.tip} tip</p>
                )}
              </div>
            </div>

            <div className="border-t border-b py-3 my-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium">{order.paymentMode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-medium">{order.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{order.time || order.date}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Items</p>
              <p className="text-sm font-medium">{order.items}</p>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  Pickup: {order.pickupArea}
                </p>
                <p className="text-xs text-gray-500">Drop: {order.dropArea}</p>
              </div>
              {order.rating && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1">{order.rating}</span>
                </div>
              )}
            </div>

            {order.reason && (
              <div className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">
                Reason: {order.reason}
              </div>
            )}

            <div className="border-t pt-3">
              <Link
                href={`/orders/${order.id}`}
                className="w-full bg-blue-500 text-white py-2 rounded-lg text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {ordersByStatus[activeTab].length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No {activeTab} orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
