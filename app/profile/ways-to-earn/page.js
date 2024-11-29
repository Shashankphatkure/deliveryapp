export default function WaysToEarn() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ways to Earn</h1>

      {/* Earnings Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-2">Your Earning Potential</h2>
        <div className="text-3xl font-bold text-green-600 mb-2">₹2,000/day</div>
        <p className="text-sm text-gray-600">
          Average earnings of top performers
        </p>
      </div>

      {/* Earning Methods */}
      <div className="space-y-4">
        {/* Regular Deliveries */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Regular Deliveries</h3>
              <p className="text-sm text-gray-500">₹50-150 per delivery</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Complete more deliveries during peak hours to maximize earnings
          </p>
        </div>

        {/* Peak Hours Bonus */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            </div>
            <div>
              <h3 className="font-medium">Peak Hours Bonus</h3>
              <p className="text-sm text-gray-500">Extra ₹50 per delivery</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Earn extra during lunch (12-3 PM) and dinner (7-10 PM) hours
          </p>
        </div>

        {/* Weekly Targets */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Weekly Targets</h3>
              <p className="text-sm text-gray-500">Up to ₹2,000 bonus</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Complete weekly delivery targets to earn additional bonuses
          </p>
        </div>

        {/* Referral Program */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Referral Program</h3>
              <p className="text-sm text-gray-500">₹1,000 per referral</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Invite other drivers and earn when they complete their first 50
            deliveries
          </p>
        </div>
      </div>
    </div>
  );
}
