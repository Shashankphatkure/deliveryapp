"use client";
import { useState } from "react";

export default function Reviews() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const stats = {
    totalReviews: 156,
    averageRating: 4.8,
    ratingBreakdown: {
      5: 70,
      4: 20,
      3: 5,
      2: 3,
      1: 2,
    },
    badges: [
      { name: "Professional Driver", count: 45 },
      { name: "On Time", count: 38 },
      { name: "Great Service", count: 32 },
      { name: "Very Polite", count: 25 },
    ],
  };

  const reviews = [
    {
      id: 1,
      rating: 5,
      date: "2 days ago",
      orderId: "1234",
      customerName: "Rahul M.",
      comment:
        "Great service and very professional delivery. The driver was polite and on time.",
      badges: ["Professional Driver", "On Time"],
      response: null,
      helpful: 3,
      orderDetails: {
        restaurant: "Pizza Hub",
        amount: "₹950",
        date: "March 15, 2024",
      },
    },
    {
      id: 2,
      rating: 4,
      date: "1 week ago",
      orderId: "1235",
      customerName: "Priya S.",
      comment: "Good delivery service, but took a bit longer than expected.",
      badges: ["Professional Driver"],
      response:
        "Thank you for your feedback. We strive to improve our delivery times.",
      helpful: 1,
      orderDetails: {
        restaurant: "Burger King",
        amount: "₹750",
        date: "March 10, 2024",
      },
    },
    // Add more reviews as needed
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>

      {/* Rating Summary Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-4xl font-bold">{stats.averageRating}</span>
            <div className="ml-3">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {stats.totalReviews} reviews
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">+0.2</div>
            <div className="text-xs text-gray-500">From last month</div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2 mb-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <button
                onClick={() => setRatingFilter(rating.toString())}
                className="w-12 text-sm text-gray-600 hover:text-blue-600"
              >
                {rating} star
              </button>
              <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-yellow-400 rounded transition-all duration-300"
                  style={{ width: `${stats.ratingBreakdown[rating]}%` }}
                ></div>
              </div>
              <span className="w-12 text-sm text-gray-600 text-right">
                {stats.ratingBreakdown[rating]}%
              </span>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {stats.badges.map((badge) => (
            <div
              key={badge.name}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {badge.name} ({badge.count})
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Time Period
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rating</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sort By</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${
                        index < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-medium">{review.customerName}</p>
                <p className="text-sm text-gray-500">
                  Order #{review.orderId} • {review.date}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded p-2 mb-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{review.orderDetails.restaurant}</span>
                <span>{review.orderDetails.amount}</span>
              </div>
              <div className="text-gray-500 text-xs">
                {review.orderDetails.date}
              </div>
            </div>

            <p className="text-gray-600 mb-3">{review.comment}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {review.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Response */}
            {review.response && (
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm font-medium mb-1">Your Response:</p>
                <p className="text-sm text-gray-600">{review.response}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between text-sm">
              <button className="flex items-center text-gray-500 hover:text-blue-600">
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>Helpful ({review.helpful})</span>
              </button>
              {!review.response && (
                <button className="text-blue-600 hover:text-blue-700">
                  Respond to Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
