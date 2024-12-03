"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [orders, setOrders] = useState({
    active: [],
    completed: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayCount: 0,
    percentageChange: 0,
    totalTime: 0,
    timeChange: 0,
    totalRevenue: 0,
    revenueChange: 0,
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  const fetchOrders = async () => {
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

      // Fetch today's orders
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      const [ordersToday, ordersYesterday] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .eq("driverid", userData.id)
          .gte("created_at", `${today}T00:00:00`)
          .lte("created_at", `${today}T23:59:59`),
        supabase
          .from("orders")
          .select("*")
          .eq("driverid", userData.id)
          .gte("created_at", `${yesterday}T00:00:00`)
          .lte("created_at", `${yesterday}T23:59:59`),
      ]);

      // Calculate percentage change
      const todayCount = ordersToday.data?.length || 0;
      const yesterdayCount = ordersYesterday.data?.length || 0;
      const percentageChange = yesterdayCount
        ? (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(0)
        : 0;

      // Calculate total time from all orders today
      const { data: timeDataToday } = await supabase
        .from("orders")
        .select("time")
        .eq("driverid", userData.id)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      // Sum up all times
      const totalTime =
        timeDataToday?.reduce((acc, order) => {
          const minutes = parseInt(order.time?.replace(/[^0-9]/g, "") || 0);
          return acc + minutes;
        }, 0) || 0;

      // Get yesterday's total time for comparison
      const { data: timeDataYesterday } = await supabase
        .from("orders")
        .select("time")
        .eq("driverid", userData.id)
        .gte("created_at", `${yesterday}T00:00:00`)
        .lte("created_at", `${yesterday}T23:59:59`);

      const yesterdayTotalTime =
        timeDataYesterday?.reduce((acc, order) => {
          const minutes = parseInt(order.time?.replace(/[^0-9]/g, "") || 0);
          return acc + minutes;
        }, 0) || 0;

      // Calculate time difference percentage
      const timeChange = yesterdayTotalTime
        ? (
            ((totalTime - yesterdayTotalTime) / yesterdayTotalTime) *
            100
          ).toFixed(0)
        : 0;

      // Calculate total revenue from today's orders
      const { data: revenueDataToday } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("driverid", userData.id)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      const totalRevenue =
        revenueDataToday?.reduce((acc, order) => {
          return acc + (order.total_amount || 0);
        }, 0) || 0;

      // Get yesterday's revenue for comparison
      const { data: revenueDataYesterday } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("driverid", userData.id)
        .gte("created_at", `${yesterday}T00:00:00`)
        .lte("created_at", `${yesterday}T23:59:59`);

      const yesterdayRevenue =
        revenueDataYesterday?.reduce((acc, order) => {
          return acc + (order.total_amount || 0);
        }, 0) || 0;

      // Calculate revenue change percentage
      const revenueChange = yesterdayRevenue
        ? (
            ((totalRevenue - yesterdayRevenue) / yesterdayRevenue) *
            100
          ).toFixed(0)
        : 0;

      setStats((prevStats) => ({
        ...prevStats,
        todayCount,
        percentageChange,
        totalTime,
        timeChange: Number(timeChange),
        totalRevenue,
        revenueChange: Number(revenueChange),
      }));

      // Then fetch orders using the user's ID from the users table
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
          )
        `
        )
        .eq("driverid", userData.id)
        .gte("created_at", `${selectedDate}T00:00:00`)
        .lte("created_at", `${selectedDate}T23:59:59`);

      if (error) throw error;

      // Update categorization to include 'delivered' status in completed
      const categorizedOrders = {
        active: data.filter((order) =>
          [
            "pending",
            "in_progress",
            "picked_up",
            "confirmed",
            "accepted",
            "on_way",
            "reached",
          ].includes(order.status)
        ),
        completed: data.filter((order) =>
          ["completed", "delivered"].includes(order.status)
        ),
        cancelled: data.filter((order) => order.status === "cancelled"),
      };

      setOrders(categorizedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
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
          <p className="text-xl font-bold">{stats.todayCount}</p>
          <p
            className={`text-xs ${
              Number(stats.percentageChange) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {stats.percentageChange > 0 ? "↑" : "↓"}{" "}
            {Math.abs(stats.percentageChange)}% from yesterday
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-gray-600 text-sm">Total Time</p>
          <p className="text-xl font-bold">{stats.totalTime} min</p>
          <p
            className={`text-xs ${
              Math.abs(stats.timeChange) < 5
                ? "text-yellow-600"
                : stats.timeChange <= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {Math.abs(stats.timeChange) < 5
              ? "↔ Same as usual"
              : stats.timeChange <= 0
              ? `↓ ${Math.abs(stats.timeChange)}% less`
              : `↑ ${stats.timeChange}% more`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-gray-600 text-sm">Today's Revenue</p>
          <p className="text-xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
          <p
            className={`text-xs ${
              Math.abs(stats.revenueChange) < 5
                ? "text-yellow-600"
                : stats.revenueChange >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {Math.abs(stats.revenueChange) < 5
              ? "↔ Same as usual"
              : stats.revenueChange > 0
              ? `↑ ${Math.abs(stats.revenueChange)}% up`
              : `↓ ${Math.abs(stats.revenueChange)}% down`}
          </p>
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
        {loading ? (
          <div className="text-center py-8">
            <p>Loading orders...</p>
          </div>
        ) : (
          orders[activeTab].map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <h3 className="font-medium mt-2">Order #{order.id}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">
                    ₹{order.total_amount}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-3 my-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{order.customername}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-medium">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-medium">{order.distance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{order.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Pickup: {order.start}</p>
                  <p className="text-xs text-gray-500">
                    Drop: {order.destination}
                  </p>
                </div>
              </div>

              {order.delivery_notes && (
                <div className="bg-yellow-50 text-yellow-700 text-sm p-2 rounded mb-3">
                  Notes: {order.delivery_notes}
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
          ))
        )}

        {!loading && orders[activeTab].length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No {activeTab} orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
