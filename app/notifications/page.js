"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // First get the user's ID from users table using auth_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      if (!userData) {
        console.error("User not found");
        setLoading(false);
        return;
      }

      // Then fetch notifications using the user's ID
      const { data: notificationsData, error: notificationsError } =
        await supabase
          .from("notifications")
          .select("*")
          .eq("recipient_id", userData.id)
          .eq("recipient_type", "driver")
          .order("created_at", { ascending: false });

      if (notificationsError) {
        console.error("Error fetching notifications:", notificationsError);
        setLoading(false);
        return;
      }

      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use the function in useEffect
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const icons = {
      order: (
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
      payment: (
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
      penalty: (
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
      system: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
        </svg>
      ),
    };
    return icons[type] || icons.system;
  };

  const getBackgroundColor = (type) => {
    const colors = {
      order: "bg-blue-100",
      payment: "bg-green-100",
      penalty: "bg-red-100",
      system: "bg-purple-100",
    };
    return colors[type] || "bg-gray-100";
  };

  const formatDate = (dateString) => {
    try {
      // Format the date in Indian timezone
      return formatInTimeZone(
        new Date(dateString),
        "Asia/Kolkata",
        "dd/MM/yyyy hh:mm a"
      );
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const getFilteredNotifications = () => {
    if (activeFilter === "all") {
      return notifications;
    }
    if (activeFilter === "today") {
      const today = new Date();
      // Set to Indian midnight
      const indianMidnight = new Date(
        today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      indianMidnight.setHours(0, 0, 0, 0);

      return notifications.filter(
        (notification) => new Date(notification.created_at) >= indianMidnight
      );
    }
    return notifications.filter(
      (notification) => notification.type === activeFilter
    );
  };

  // Add skeleton loading component
  const NotificationSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start">
        <div className="bg-gray-200 p-2 rounded-full mr-3 animate-pulse">
          <div className="w-6 h-6"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-2 bg-gray-200 rounded animate-pulse w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={fetchNotifications}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Notification Filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "today", label: "Today" },
          { key: "order", label: "Orders" },
          { key: "payment", label: "Earnings" },
          { key: "penalty", label: "Penalties" },
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
        {loading ? (
          // Show 5 skeleton loaders while loading
          [...Array(5)].map((_, index) => <NotificationSkeleton key={index} />)
        ) : (
          <>
            {getFilteredNotifications().map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow p-4 ${
                  notification.type === "order"
                    ? "cursor-pointer hover:bg-gray-50"
                    : ""
                }`}
                onClick={() => {
                  // Only navigate if it's an order notification and has an order_id
                  if (notification.type === "order" && notification.order_id) {
                    router.push(`/orders/${notification.order_id}`);
                  }
                }}
              >
                <div className="flex items-start">
                  <div
                    className={`${getBackgroundColor(
                      notification.type
                    )} p-2 rounded-full mr-3`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(notification.created_at)}
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
          </>
        )}
      </div>
    </div>
  );
}
