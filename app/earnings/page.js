"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Earnings() {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    today: { total: 0, count: 0 },
    week: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
    lastMonth: { total: 0, count: 0 },
  });
  const [user, setUser] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get the logged-in user
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) {
        // Get the driver details from users table
        const { data: driverData } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", currentUser.id)
          .single();

        setUser(driverData);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
      calculateSummary();
    }
  }, [dateRange, user]);

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["delivered", "paid"])
      .eq("driverid", user.id)
      .gte("created_at", dateRange.from)
      .lte("created_at", dateRange.to)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }
    setOrders(data || []);
  };

  const calculateSummary = async () => {
    if (!user) return;

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const startOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay())
    ).toISOString();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    ).toISOString();
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).toISOString();

    // Fetch summary data for different periods
    const { data: todayData } = await supabase
      .from("orders")
      .select("total_amount")
      .in("status", ["delivered", "paid"])
      .eq("driverid", user.id)
      .gte("created_at", startOfToday);

    const { data: weekData } = await supabase
      .from("orders")
      .select("total_amount")
      .in("status", ["delivered", "paid"])
      .eq("driverid", user.id)
      .gte("created_at", startOfWeek);

    const { data: monthData } = await supabase
      .from("orders")
      .select("total_amount")
      .in("status", ["delivered", "paid"])
      .eq("driverid", user.id)
      .gte("created_at", startOfMonth);

    const { data: lastMonthData } = await supabase
      .from("orders")
      .select("total_amount")
      .in("status", ["delivered", "paid"])
      .eq("driverid", user.id)
      .gte("created_at", startOfLastMonth)
      .lte("created_at", endOfLastMonth);

    setSummary({
      today: {
        total: sumTotal(todayData),
        count: todayData?.length || 0,
      },
      week: {
        total: sumTotal(weekData),
        count: weekData?.length || 0,
      },
      month: {
        total: sumTotal(monthData),
        count: monthData?.length || 0,
      },
      lastMonth: {
        total: sumTotal(lastMonthData),
        count: lastMonthData?.length || 0,
      },
    });
  };

  const sumTotal = (data) => {
    return (
      data?.reduce(
        (sum, order) => sum + (Number(order.total_amount) || 0),
        0
      ) || 0
    );
  };

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <Link
          href="/earnings/payouts"
          className="text-blue-500 flex items-center"
        >
          <span>Payouts</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Earnings Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">Today</p>
            <p className="text-2xl font-bold">
              ₹{summary.today.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {summary.today.count} orders
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">This Week</p>
            <p className="text-2xl font-bold">
              ₹{summary.week.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{summary.week.count} orders</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">This Month</p>
            <p className="text-2xl font-bold">
              ₹{summary.month.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {summary.month.count} orders
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">Last Month</p>
            <p className="text-2xl font-bold">
              ₹{summary.lastMonth.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {summary.lastMonth.count} orders
            </p>
          </div>
        </div>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Earnings History</h2>
        </div>
        <div className="divide-y">
          {orders.map((order) => (
            <Link
              href={`/earnings/${order.id}`}
              key={order.id}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
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
                    <span>
                      {order.distance} • {order.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-600">
                    +₹{Number(order.total_amount).toFixed(2)}
                  </span>
                  {order.delivery_notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      {order.delivery_notes}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
