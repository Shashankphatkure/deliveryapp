"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginHistory() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [sessions, setSessions] = useState({ current: null, history: [] });
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchLoginHistory();
  }, [timeFilter]);

  const fetchLoginHistory = async () => {
    try {
      // First get the current user's email
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Get time filter condition
      const timeCondition = (() => {
        const now = new Date();
        switch (timeFilter) {
          case "today":
            return now.setDate(now.getDate() - 1);
          case "week":
            return now.setDate(now.getDate() - 7);
          case "month":
            return now.setDate(now.getDate() - 30);
          default:
            return now.setDate(now.getDate() - 90);
        }
      })();

      // Fetch audit logs for the current user
      const { data, error } = await supabase
        .from("audit_log_entries")
        .select("*")
        .eq("payload->>actor_username", user.email)
        .gte("created_at", new Date(timeCondition).toISOString())
        .or(
          "payload->>action.eq.login,payload->>action.eq.token_refreshed,payload->>action.eq.token_revoked,payload->>action.eq.user_signedup,payload->>action.eq.user_repeated_signup"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data
      const transformedSessions = data.map((entry) => ({
        id: entry.id,
        deviceType: "Browser",
        deviceModel: "Unknown Device",
        browser: entry.payload?.actor_via_sso ? "SSO Login" : "Direct Login",
        os: "Unknown",
        ip: entry.ip_address,
        location: "Location not available",
        startTime: new Date(entry.created_at).toLocaleString(),
        status: getSessionStatus(entry.payload?.action),
        userDetails: {
          email: entry.payload?.actor_username,
          provider: entry.payload?.traits?.provider || "email",
        },
        activities: [
          {
            type: getActivityType(entry.payload?.action),
            time: new Date(entry.created_at).toLocaleTimeString(),
            details: getActivityDetails(entry),
          },
        ],
      }));

      // Set the most recent session as current if it's within the last hour
      const currentSession =
        transformedSessions[0]?.created_at > Date.now() - 3600000
          ? transformedSessions.shift()
          : null;

      setSessions({
        current: currentSession,
        history: transformedSessions,
      });
    } catch (error) {
      console.error("Error fetching login history:", error);
    }
  };

  const getSessionStatus = (action) => {
    switch (action) {
      case "token_revoked":
        return "Ended";
      case "user_signedup":
        return "Signup";
      case "user_repeated_signup":
        return "Repeated Signup";
      case "login":
        return "Completed";
      case "token_refreshed":
        return "Active";
      default:
        return "Unknown";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "order_completed":
        return (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case "break_started":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
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
        );
      case "driver_mode":
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        );
      case "logout":
        return (
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-800",
      Completed: "bg-blue-100 text-blue-800",
      Suspicious: "bg-red-100 text-red-800",
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      styles[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getActivityType = (action) => {
    switch (action) {
      case "login":
        return "login";
      case "token_revoked":
        return "logout";
      case "token_refreshed":
        return "session_refreshed";
      case "user_signedup":
        return "signup";
      case "user_repeated_signup":
        return "repeated_signup";
      default:
        return "unknown";
    }
  };

  const getActivityDetails = (entry) => {
    const action = entry.payload?.action;
    const email = entry.payload?.actor_username;
    const ip = entry.ip_address;
    const provider = entry.payload?.traits?.provider || "email";

    switch (action) {
      case "login":
        return `Logged in via ${provider} from ${ip}`;
      case "token_revoked":
        return `Logged out from ${ip}`;
      case "token_refreshed":
        return `Session refreshed from ${ip}`;
      case "user_signedup":
        return `Signed up via ${provider} from ${ip}`;
      case "user_repeated_signup":
        return `Repeated signup attempt via ${provider} from ${ip}`;
      default:
        return `Unknown activity from ${ip}`;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login History</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
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
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Device Type
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
            >
              <option value="all">All Devices</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Session */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Current Session</h2>
            <span className={getStatusBadge("Active")}>Active Now</span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>
                {sessions.current?.deviceModel} • {sessions.current?.browser} •{" "}
                {sessions.current?.os}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {sessions.current?.location} • IP: {sessions.current?.ip}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {sessions.current?.activities.map((activity, index) => (
              <div key={index} className="flex items-start">
                {getActivityIcon(activity.type)}
                <div className="ml-3">
                  <p className="text-sm font-medium">{activity.details}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previous Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Previous Sessions</h2>
        </div>
        <div className="divide-y">
          {sessions.history.map((session) => (
            <div key={session.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <span className={getStatusBadge(session.status)}>
                      {session.status}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {session.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>
                <button className="text-blue-600 text-sm hover:underline">
                  Details
                </button>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {session.deviceModel} • {session.browser} • {session.os}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {session.location} • IP: {session.ip}
                  </span>
                </div>
              </div>

              {/* Session Activities */}
              <div className="space-y-3">
                {session.activities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    {getActivityIcon(activity.type)}
                    <div className="ml-3">
                      <p className="text-sm font-medium">{activity.details}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
