import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function EarningDetail({ params }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!order) {
    return <div>Order not found</div>;
  }

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
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      </div>

      {/* Earning Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
            {order.status}
          </span>
          <span className="text-lg font-bold">₹{order.total_amount}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date & Time</span>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Distance</span>
            <span>{order.distance}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration</span>
            <span>{order.time}</span>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-4">Earnings Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Fare</span>
            <span>₹700.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Distance Bonus</span>
            <span>₹150.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Peak Hour Bonus</span>
            <span>₹50.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tips</span>
            <span>₹50.00</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total Earnings</span>
            <span>₹950.00</span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Order Details</h2>
        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="flex">
            <div className="mr-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">Pickup Location</p>
              <p className="text-sm text-gray-600">{order.start}</p>
            </div>
          </div>

          {/* Dotted Line */}
          <div className="ml-4 border-l-2 border-dashed h-8 border-gray-200"></div>

          {/* Drop Location */}
          <div className="flex">
            <div className="mr-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">Drop Location</p>
              <p className="text-sm text-gray-600">{order.destination}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
