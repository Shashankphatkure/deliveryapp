"use client";
import { useState } from "react";
import Link from "next/link";

export default function Payouts() {
  const [monthYear, setMonthYear] = useState(
    new Date().toISOString().slice(0, 7)
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Link href="/earnings" className="mr-2">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Payouts</h1>
      </div>

      {/* Month Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <label className="block text-sm text-gray-600 mb-1">Select Month</label>
        <input
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Payout Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold">₹28,450.00</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Payouts</p>
            <p className="text-2xl font-bold">₹25,000.00</p>
          </div>
        </div>
      </div>

      {/* Payout List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Payout History</h2>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((item) => (
            <Link
              href={`/earnings/payouts/${item}`}
              key={item}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Payout #{item}</p>
                  <p className="text-sm text-gray-500">15 March, 2024</p>
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span>Weekly Payout</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-600">₹8,450.00</span>
                  <p className="text-xs text-gray-500 mt-1">To HDFC Bank</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
