"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "./utils/date";

export default function Home() {
  const [isDriverModeOn, setIsDriverModeOn] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingState, setPendingState] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [checklist, setChecklist] = useState({
    uniform: false,
    helmet: false,
    documents: false,
    vehicle: false,
    phone: false,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Driver");
  const supabase = createClientComponentClient();

  const handleToggle = (newState) => {
    setPendingState(newState);
    setChecklist({
      uniform: false,
      helmet: false,
      documents: false,
      vehicle: false,
      phone: false,
    });
    setShowConfirmModal(true);
  };

  const confirmToggle = () => {
    const allChecked = Object.values(checklist).every(
      (value) => value === true
    );
    if (!allChecked) {
      alert("Please confirm all safety requirements");
      return;
    }

    setIsDriverModeOn(pendingState);
    setShowConfirmModal(false);
  };

  const handleChecklistChange = (item) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const timeframes = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("auth_id", user.id)
        .single();

      if (userError) throw userError;
      if (!userData) {
        console.error("No user record found");
        return;
      }

      setUserName(userData.full_name || "Driver");

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          status,
          total_amount,
          remark
        `
        )
        .eq("driverid", userData.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      setRecentActivity(data);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">Welcome, {userName}!</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="text-sm text-blue-800 font-medium">
              Rating: 4.8
            </span>
          </div>
        </div>
      </div>

      {/* Driver Mode Toggle */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Driver Mode</span>
            <p className="text-sm text-gray-500">Active time today: 6h 30m</p>
            <p className="text-xs text-gray-400 mt-1">Auto-off at 10:00 PM</p>
          </div>
          <div className="flex flex-col items-end">
            <button
              onClick={() => handleToggle(!isDriverModeOn)}
              className={`px-4 py-2 rounded-full transition-colors ${
                isDriverModeOn
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isDriverModeOn ? "Turn Off" : "Turn On"}
            </button>
            {isDriverModeOn && (
              <span className="text-xs text-green-600 mt-1">
                Available for orders
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.key}
            onClick={() => setSelectedTimeframe(timeframe.key)}
            className={`px-4 py-1 rounded-full text-sm ${
              selectedTimeframe === timeframe.key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/earnings" className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Earnings</h3>
          <p className="text-2xl font-bold">₹950.00</p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              +₹150 from yesterday
            </span>
          </div>
        </Link>
        <Link href="/orders" className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Orders</h3>
          <p className="text-2xl font-bold">8</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="text-green-600">6 completed</span>
            <span className="mx-1">•</span>
            <span className="text-red-600">2 cancelled</span>
          </div>
        </Link>
      </div>

      {/* Progress Cards */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Today's Progress</h2>
          <Link href="/ways-to-earn" className="text-blue-500 text-sm">
            View Targets
          </Link>
        </div>
        <div className="p-4 space-y-4">
          {/* Orders Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Orders Target</span>
              <div className="flex items-center">
                <span className="font-medium">8/15 orders</span>
                <span className="text-xs text-green-600 ml-2">(53%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                style={{ width: "53%" }}
              ></div>
            </div>
          </div>

          {/* Earnings Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Earnings Target</span>
              <div className="flex items-center">
                <span className="font-medium">₹950/₹2000</span>
                <span className="text-xs text-yellow-600 ml-2">(47.5%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2 transition-all duration-500"
                style={{ width: "47.5%" }}
              ></div>
            </div>
          </div>

          {/* Active Time */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Active Time</span>
              <div className="flex items-center">
                <span className="font-medium">6.5/8 hours</span>
                <span className="text-xs text-green-600 ml-2">(81%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                style={{ width: "81%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Recent Activity</h2>
          <Link href="/notifications" className="text-blue-500 text-sm">
            View All
          </Link>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : recentActivity.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No recent activity
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        activity.status === "completed"
                          ? "bg-green-500"
                          : activity.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">Order #{activity.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.created_at).toRelative()}
                      </p>
                      <span
                        className={`text-xs ${
                          activity.status === "completed"
                            ? "text-green-600"
                            : activity.status === "cancelled"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {activity.status === "completed"
                          ? "Delivered"
                          : activity.status === "cancelled"
                          ? activity.remark || "Cancelled"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        activity.status === "completed"
                          ? "text-green-600"
                          : activity.status === "cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {activity.status === "completed"
                        ? `₹${activity.total_amount}`
                        : "₹0"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.status === "completed"
                        ? "Earnings"
                        : activity.status === "cancelled"
                        ? "Cancelled"
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modified Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">
              {pendingState ? "Turn On Driver Mode?" : "Turn Off Driver Mode?"}
            </h3>
            <p className="text-gray-600 mb-4">
              {pendingState
                ? "Please confirm the following safety requirements:"
                : "Please confirm the following before going offline:"}
            </p>

            {/* Checklist Section */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checklist.uniform}
                  onChange={() => handleChecklistChange("uniform")}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">
                  {pendingState
                    ? "I am wearing proper uniform"
                    : "I have completed all pending deliveries"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checklist.helmet}
                  onChange={() => handleChecklistChange("helmet")}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">
                  {pendingState
                    ? "I am wearing helmet"
                    : "I have settled all payments"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checklist.documents}
                  onChange={() => handleChecklistChange("documents")}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">
                  {pendingState
                    ? "I have all required documents"
                    : "I have reported any incidents/issues"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checklist.vehicle}
                  onChange={() => handleChecklistChange("vehicle")}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">
                  {pendingState
                    ? "My vehicle is in good condition"
                    : "I have updated my final location"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checklist.phone}
                  onChange={() => handleChecklistChange("phone")}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">
                  {pendingState
                    ? "My phone is fully charged"
                    : "I understand I won't receive new orders"}
                </span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={confirmToggle}
                className={`flex-1 py-2 rounded-lg ${
                  pendingState
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setChecklist({
                    uniform: false,
                    helmet: false,
                    documents: false,
                    vehicle: false,
                    phone: false,
                  });
                }}
                className="flex-1 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
