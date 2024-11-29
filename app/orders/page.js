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
