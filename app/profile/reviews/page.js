"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Reviews() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
    badges: [],
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchReviews();
    calculateStats();
  }, [timeFilter, ratingFilter, sortBy]);

  const fetchReviews = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Error getting session:", sessionError);
      return;
    }

    let query = supabase
      .from("user_reviews")
      .select(
        `
        *,
        orders (
          id,
          created_at,
          customername,
          status,
          total_amount
        ),
        customers (
          id,
          full_name,
          email
        ),
        stores (
          id,
          name
        )
      `
      )
      .eq("user_id", session.user.id);

    // Apply filters
    if (ratingFilter !== "all") {
      query = query.eq("rating", parseInt(ratingFilter));
    }

    if (timeFilter !== "all") {
      const date = new Date();
      switch (timeFilter) {
        case "week":
          date.setDate(date.getDate() - 7);
          break;
        case "month":
          date.setMonth(date.getMonth() - 1);
          break;
        case "year":
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      query = query.gte("created_at", date.toISOString());
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "highest":
        query = query.order("rating", { ascending: false });
        break;
      case "lowest":
        query = query.order("rating", { ascending: true });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }

    // Transform the data to match your component's structure
    const transformedReviews = data.map((review) => ({
      id: review.id,
      rating: review.rating,
      date: formatDate(review.created_at),
      orderId: review.order_id,
      customerName: review.orders?.customername || "Anonymous",
      comment: review.comment,
      badges: review.badges || [],
      orderDetails: {
        restaurant: review.restaurant_name,
        orderDate: formatDate(review.orders?.created_at),
        status: review.orders?.status,
        amount: review.orders?.total_amount
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(review.orders.total_amount)
          : "N/A",
      },
    }));

    setReviews(transformedReviews);
  };

  const calculateStats = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Error getting session:", sessionError);
      return;
    }

    const { data, error } = await supabase
      .from("user_reviews")
      .select("rating, badges")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching stats:", error);
      return;
    }

    // Calculate average rating
    const totalReviews = data.length;
    const averageRating =
      totalReviews > 0
        ? data.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    // Calculate rating breakdown
    const ratingBreakdown = data.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      },
      {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      }
    );

    // Convert to percentages
    Object.keys(ratingBreakdown).forEach((rating) => {
      ratingBreakdown[rating] =
        totalReviews > 0
          ? Math.round((ratingBreakdown[rating] / totalReviews) * 100)
          : 0;
    });

    // Calculate badge counts
    const badgeCounts = data.reduce((acc, review) => {
      (review.badges || []).forEach((badge) => {
        acc[badge] = (acc[badge] || 0) + 1;
      });
      return acc;
    }, {});

    const badges = Object.entries(badgeCounts).map(([name, count]) => ({
      name,
      count,
    }));

    setStats({
      totalReviews,
      averageRating: averageRating.toFixed(1),
      ratingBreakdown,
      badges,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded p-2 mb-3 text-sm">
              <div className="text-gray-600">
                <span>{review.orderDetails.restaurant}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-3">{review.comment}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {review.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
