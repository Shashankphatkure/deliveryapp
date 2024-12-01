"use client";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Profile() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userData, setUserData] = useState({ full_name: "Loading..." });
  const [stats, setStats] = useState({
    totalOrders: 0,
    monthlyOrders: 0,
    penalties: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current auth user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;

        // Get user details using auth_id
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*") // Select all fields to get vehicle info, etc.
          .eq("auth_id", user.id)
          .single();
        if (userError) throw userError;
        if (userData) setUserData(userData);

        // Get total orders (delivered + paid)
        const { count: totalOrders, error: totalError } = await supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("driverid", userData.id) // Use users.id instead of auth.id
          .eq("status", "delivered");

        if (totalError) throw totalError;

        // Get this month's orders
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: monthlyOrders, error: monthlyError } = await supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("driverid", userData.id) // Use users.id instead of auth.id
          .eq("status", "delivered")
          .eq("payment_status", "completed")
          .gte("created_at", startOfMonth.toISOString());
        if (monthlyError) throw monthlyError;

        // Get total penalties
        const { count: penalties, error: penaltyError } = await supabase
          .from("penalties")
          .select("*", { count: "exact" })
          .eq("driver_id", userData.id); // Use users.id instead of auth.id
        if (penaltyError) throw penaltyError;

        setStats({
          totalOrders: totalOrders || 0,
          monthlyOrders: monthlyOrders || 0,
          penalties: penalties || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Link
          href="/emergency"
          className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg"
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Emergency
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mr-4">
            {/* Profile image will go here */}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {userData.full_name || "Update your profile"}
            </h2>
            <p className="text-gray-600">ID: DRV123456</p>
            <div className="flex items-center mt-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm ml-1">4.8 Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-gray-600 text-sm">This Month</p>
          <p className="text-xl font-bold">{stats.monthlyOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-gray-600 text-sm">Penalties</p>
          <p className="text-xl font-bold">{stats.penalties}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-lg shadow">
        <nav className="divide-y">
          <a href="/profile/account" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Account Settings
          </a>

          <a href="/profile/ways-to-earn" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
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
            Ways to Earn
          </a>

          <a href="/profile/rules" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Rules & Regulations
          </a>

          <Link href="/weather" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            Weather & Safety Alerts
          </Link>

          <a href="/profile/help" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help & Support
          </a>

          <a href="/profile/penalties" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
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
            Penalties
          </a>

          <a href="/profile/login-history" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
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
            Login History
          </a>

          <a href="/profile/reviews" className="flex items-center p-4">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Reviews
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
