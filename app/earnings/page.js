"use client";
import { useState } from "react";
import Link from "next/link";

export default function Earnings() {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

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
            <p className="text-2xl font-bold">₹2,450.00</p>
            <p className="text-sm text-gray-500">3 orders</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">This Week</p>
            <p className="text-2xl font-bold">₹8,450.00</p>
            <p className="text-sm text-gray-500">8 orders</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">This Month</p>
            <p className="text-2xl font-bold">₹32,150.00</p>
            <p className="text-sm text-gray-500">35 orders</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 text-sm">Last Month</p>
            <p className="text-2xl font-bold">₹28,900.00</p>
            <p className="text-sm text-gray-500">31 orders</p>
          </div>
        </div>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Earnings History</h2>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((item) => (
            <Link
              href={`/earnings/${item}`}
              key={item}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #123{item}</p>
                  <p className="text-sm text-gray-500">Today, 2:30 PM</p>
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
                    <span>5.2 km • 25 mins</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-600">+₹950.00</span>
                  <p className="text-xs text-gray-500 mt-1">Inc. ₹50 bonus</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
