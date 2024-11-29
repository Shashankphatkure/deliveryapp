import Link from "next/link";

export default function PayoutDetail({ params }) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Link href="/earnings/payouts" className="mr-2">
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
        <h1 className="text-2xl font-bold">Payout #123{params.id}</h1>
      </div>

      {/* Payout Status */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
            Completed
          </span>
          <span className="text-lg font-bold">₹8,450.00</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transfer Date</span>
            <span>15 March, 2024</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bank Account</span>
            <span>HDFC Bank ****1234</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Reference ID</span>
            <span>TXN123456789</span>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-4">Earnings Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Earnings</span>
            <span>₹7,500.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Peak Hour Bonus</span>
            <span>₹600.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Incentives</span>
            <span>₹350.00</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>₹8,450.00</span>
          </div>
        </div>
      </div>

      {/* Orders Included */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Orders Included (15)</h2>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((item) => (
            <Link
              href={`/earnings/${item}`}
              key={item}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Order #123{item}</p>
                  <p className="text-sm text-gray-500">15 March, 2:30 PM</p>
                </div>
                <span className="text-green-600">₹550.00</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
