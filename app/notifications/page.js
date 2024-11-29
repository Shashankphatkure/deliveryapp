"use client";
import { useState } from "react";

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("all");

  const notifications = {
    orders: [
      {
        type: "order",
        title: "New Order Available",
        message: "New delivery order in your area",
        time: "2 minutes ago",
        icon: (
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        ),
        bgColor: "bg-blue-100",
      },
      {
        type: "order",
        title: "Order Cancelled",
        message: "Order #1234 has been cancelled by the customer",
        time: "30 minutes ago",
        icon: (
          <svg
            className="w-6 h-6 text-red-500"
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
        ),
        bgColor: "bg-red-100",
      },
    ],
    earnings: [
      {
        type: "earnings",
        title: "Payment Received",
        message: "You received ₹950.00 for order #1234",
        time: "1 hour ago",
        icon: (
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        bgColor: "bg-green-100",
      },
      {
        type: "earnings",
        title: "Weekly Bonus Achieved",
        message:
          "Congratulations! You earned ₹500 bonus for completing 50 deliveries",
        time: "2 hours ago",
        icon: (
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        ),
        bgColor: "bg-yellow-100",
      },
    ],
    penalties: [
      {
        type: "penalties",
        title: "Late Delivery Penalty",
        message:
          "A penalty of ₹100 has been applied for late delivery of order #1235",
        time: "3 hours ago",
        icon: (
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        bgColor: "bg-red-100",
      },
      {
        type: "penalties",
        title: "Order Cancellation Penalty",
        message:
          "Penalty applied for cancelling order #1236 without valid reason",
        time: "1 day ago",
        icon: (
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        bgColor: "bg-red-100",
      },
    ],
    system: [
      {
        type: "system",
        title: "App Update Available",
        message:
          "A new version of the app is available. Please update for better performance.",
        time: "5 hours ago",
        icon: (
          <svg
            className="w-6 h-6 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        ),
        bgColor: "bg-purple-100",
      },
      {
        type: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance on Sunday, 2 AM - 4 AM",
        time: "1 day ago",
        icon: (
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        bgColor: "bg-gray-100",
      },
    ],
  };

  const getAllNotifications = () => {
    return [
      ...notifications.orders,
      ...notifications.earnings,
      ...notifications.penalties,
      ...notifications.system,
    ].sort((a, b) => {
      // Simple sort by time (you might want to use actual timestamps in production)
      return a.time > b.time ? -1 : 1;
    });
  };

  const getFilteredNotifications = () => {
    if (activeFilter === "all") {
      return getAllNotifications();
    }
    if (activeFilter === "today") {
      // Filter notifications that contain "minutes ago", "hours ago" or "just now"
      return getAllNotifications().filter((notification) => {
        const timeText = notification.time.toLowerCase();
        return (
          timeText.includes("minutes ago") ||
          timeText.includes("hours ago") ||
          timeText.includes("just now")
        );
      });
    }
    return notifications[activeFilter] || [];
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* Notification Filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "today", label: "Today" },
          { key: "orders", label: "Orders" },
          { key: "earnings", label: "Earnings" },
          { key: "penalties", label: "Penalties" },
          { key: "system", label: "System" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-1 rounded-full text-sm ${
              activeFilter === filter.key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {getFilteredNotifications().map((notification, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start">
              <div className={`${notification.bgColor} p-2 rounded-full mr-3`}>
                {notification.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-gray-600 text-sm">{notification.message}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}

        {getFilteredNotifications().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
