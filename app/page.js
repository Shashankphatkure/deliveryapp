"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "./utils/date";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [isDriverModeOn, setIsDriverModeOn] = useState(false);
  const [isLoadingDriverMode, setIsLoadingDriverMode] = useState(true);
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
  const [statistics, setStatistics] = useState({
    earnings: 0,
    earningsChange: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [progress, setProgress] = useState({
    ordersTarget: 15,
    ordersCompleted: 0,
    earningsTarget: 2000,
    earningsCompleted: 0,
    activeTimeTarget: 8,
    activeTimeCompleted: 0,
  });
  const [driverRating, setDriverRating] = useState({
    score: 0,
    penaltiesSummary: [],
    showDetails: false,
  });
  const [activeSession, setActiveSession] = useState(null);
  const [todayActiveTime, setTodayActiveTime] = useState(0);

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

  const confirmToggle = async () => {
    const allChecked = Object.values(checklist).every(
      (value) => value === true
    );
    if (!allChecked) {
      alert("Please confirm all safety requirements");
      return;
    }

    try {
      setIsLoadingDriverMode(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (pendingState) {
        // Starting a new session
        const { data: session, error: sessionError } = await supabase
          .from("driver_sessions")
          .insert([{ user_id: userData.id }])
          .select()
          .single();

        if (sessionError) throw sessionError;
        setActiveSession(session);
      } else {
        // Ending current session
        if (activeSession) {
          const { error: updateError } = await supabase
            .from("driver_sessions")
            .update({ end_time: new Date().toISOString() })
            .eq("id", activeSession.id);

          if (updateError) throw updateError;
          setActiveSession(null);
        }
      }

      const { error } = await supabase
        .from("users")
        .update({ is_active: pendingState })
        .eq("auth_id", user.id);

      if (error) throw error;

      setIsDriverModeOn(pendingState);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error updating driver mode:", error);
      alert("Failed to update driver mode. Please try again.");
    } finally {
      setIsLoadingDriverMode(false);
    }
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

  const getDateRange = (timeframe) => {
    const now = new Date();
    const start = new Date();

    switch (timeframe) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
    }

    return { start, end: now };
  };

  const fetchStatistics = async (timeframe) => {
    try {
      const { start, end } = getDateRange(timeframe);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (!userData) return;

      // Fetch current period orders
      const { data: currentOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("driverid", userData.id)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      // Calculate statistics
      const completed = currentOrders.filter(
        (order) => order.status === "completed"
      );
      const cancelled = currentOrders.filter(
        (order) => order.status === "cancelled"
      );
      const totalEarnings = completed.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      // For earnings change, fetch previous period
      const previousStart = new Date(start);
      const previousEnd = new Date(start);
      if (timeframe === "today") {
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd.setDate(previousEnd.getDate() - 1);
      }

      const { data: previousOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("driverid", userData.id)
        .eq("status", "completed")
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      const previousEarnings = previousOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      setStatistics({
        earnings: totalEarnings,
        earningsChange: totalEarnings - previousEarnings,
        totalOrders: currentOrders.length,
        completedOrders: completed.length,
        cancelledOrders: cancelled.length,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchTodayProgress = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (!userData) return;

      // Fetch today's completed orders and earnings
      const { data: todayOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("driverid", userData.id)
        .eq("status", "completed")
        .gte("created_at", today.toISOString());

      const completedOrders = todayOrders.length;
      const totalEarnings = todayOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      // Calculate active time (this is a placeholder - you'll need to implement actual time tracking)
      const activeTime = todayActiveTime / 60; // Convert minutes to hours

      setProgress({
        ordersTarget: 15,
        ordersCompleted: completedOrders,
        earningsTarget: 2000,
        earningsCompleted: totalEarnings,
        activeTimeTarget: 8,
        activeTimeCompleted: activeTime,
      });
    } catch (error) {
      console.error("Error fetching today's progress:", error);
    }
  };

  const calculateRating = (penalties) => {
    // Start with 5 stars
    let rating = 5.0;

    // Deduct 0.5 stars for each penalty
    const totalPenalties = penalties.length;
    rating = Math.max(1, 5 - totalPenalties * 0.5);

    return Number(rating.toFixed(1));
  };

  const fetchDriverRating = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (!userData) return;

      const { data: penalties } = await supabase
        .from("penalties")
        .select("*")
        .eq("driver_id", userData.id)
        .order("created_at", { ascending: false });

      const rating = calculateRating(penalties);

      // Group penalties by severity for the summary
      const summary = penalties.reduce((acc, penalty) => {
        if (!acc[penalty.severity]) {
          acc[penalty.severity] = 0;
        }
        acc[penalty.severity]++;
        return acc;
      }, {});

      setDriverRating({
        score: rating,
        penaltiesSummary: Object.entries(summary),
        showDetails: false,
      });
    } catch (error) {
      console.error("Error fetching driver rating:", error);
    }
  };

  const fetchDriverModeStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("is_active")
        .eq("auth_id", user.id)
        .single();

      if (userData) {
        setIsDriverModeOn(userData.is_active);
      }
    } catch (error) {
      console.error("Error fetching driver mode status:", error);
    } finally {
      setIsLoadingDriverMode(false);
    }
  };

  const calculateTodayActiveTime = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: sessions } = await supabase
        .from("driver_sessions")
        .select("*")
        .eq("user_id", userData.id)
        .gte("start_time", today.toISOString());

      let totalMinutes = 0;
      sessions.forEach((session) => {
        const endTime = session.end_time
          ? new Date(session.end_time)
          : new Date();
        const startTime = new Date(session.start_time);
        totalMinutes += (endTime - startTime) / (1000 * 60);
      });

      setTodayActiveTime(totalMinutes);
    } catch (error) {
      console.error("Error calculating active time:", error);
    }
  };

  useEffect(() => {
    fetchDriverModeStatus();
    fetchRecentActivity();
    fetchStatistics(selectedTimeframe);
    fetchTodayProgress();
    fetchDriverRating();
    calculateTodayActiveTime();
  }, [selectedTimeframe]);

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

  const formatActiveTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
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
          <div
            className="bg-blue-100 px-3 py-1 rounded-full cursor-pointer"
            onClick={() =>
              setDriverRating((prev) => ({ ...prev, showDetails: true }))
            }
          >
            <span className="text-sm text-blue-800 font-medium">
              Rating: {driverRating.score} ★
            </span>
          </div>
        </div>
      </div>

      {/* Driver Mode Toggle */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Driver Mode</span>
            <p className="text-sm text-gray-500">
              Active time today: {formatActiveTime(todayActiveTime)}
            </p>
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
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto">
        <button
          onClick={() => {
            fetchStatistics(selectedTimeframe);
            fetchRecentActivity();
            fetchTodayProgress();
            fetchDriverRating();
            calculateTodayActiveTime();
          }}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
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
          <p className="text-2xl font-bold">
            ₹{statistics.earnings.toFixed(2)}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              {statistics.earningsChange > 0
                ? `+₹${statistics.earningsChange.toFixed(2)}`
                : `₹${statistics.earningsChange.toFixed(2)}`}{" "}
              from yesterday
            </span>
          </div>
        </Link>
        <Link href="/orders" className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Orders</h3>
          <p className="text-2xl font-bold">{statistics.totalOrders}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="text-green-600">
              {statistics.completedOrders} completed
            </span>
            <span className="mx-1">•</span>
            <span className="text-red-600">
              {statistics.cancelledOrders} cancelled
            </span>
          </div>
        </Link>
      </div>

      {/* Progress Cards */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Today's Progress</h2>
          <Link href="/profile/ways-to-earn" className="text-blue-500 text-sm">
            View Targets
          </Link>
        </div>
        <div className="p-4 space-y-4">
          {/* Orders Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Orders Target</span>
              <div className="flex items-center">
                <span className="font-medium">
                  {progress.ordersCompleted}/{progress.ordersTarget} orders
                </span>
                <span className="text-xs text-green-600 ml-2">
                  (
                  {(
                    (progress.ordersCompleted / progress.ordersTarget) *
                    100
                  ).toFixed(0)}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (progress.ordersCompleted / progress.ordersTarget) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Earnings Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Earnings Target</span>
              <div className="flex items-center">
                <span className="font-medium">
                  ₹{progress.earningsCompleted.toFixed(0)}/₹
                  {progress.earningsTarget}
                </span>
                <span className="text-xs text-yellow-600 ml-2">
                  (
                  {(
                    (progress.earningsCompleted / progress.earningsTarget) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (progress.earningsCompleted / progress.earningsTarget) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Active Time */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Active Time</span>
              <div className="flex items-center">
                <span className="font-medium">
                  {progress.activeTimeCompleted}/{progress.activeTimeTarget}{" "}
                  hours
                </span>
                <span className="text-xs text-green-600 ml-2">
                  (
                  {(
                    (progress.activeTimeCompleted / progress.activeTimeTarget) *
                    100
                  ).toFixed(0)}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (progress.activeTimeCompleted / progress.activeTimeTarget) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Recent Activity</h2>
          <Link href="/orders" className="text-blue-500 text-sm">
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
                      <p className="text-xs text-gray-500 mt-1">
                        Status: {activity.status}
                      </p>
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

      {driverRating.showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Performance Score</h3>
              <button
                onClick={() =>
                  setDriverRating((prev) => ({ ...prev, showDetails: false }))
                }
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {driverRating.score} ★
              </div>
              <p className="text-gray-600">
                Your current rating based on last 30 days performance
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-medium text-gray-700 mb-2">
                Recent Incidents:
              </p>
              {driverRating.penaltiesSummary.length > 0 ? (
                driverRating.penaltiesSummary.map(([severity, count]) => (
                  <div
                    key={severity}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                  >
                    <span className="capitalize">Priority Issues</span>
                    <span className="font-medium">
                      {count} {count === 1 ? "incident" : "incidents"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-green-600 py-4">
                  Great job! No incidents reported. Keep up the good work! 🎉
                </p>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2 font-medium">
                How to maintain a good rating:
              </p>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Complete deliveries on time</li>
                <li>• Follow safety guidelines</li>
                <li>• Maintain professional behavior</li>
                <li>• Keep your vehicle in good condition</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
