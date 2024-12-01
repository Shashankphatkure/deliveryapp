"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TrackTime() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalHours: 0,
    averageDaily: 0,
    longestSession: 0,
    totalSessions: 0,
    todayHours: 0,
    todaySessions: 0,
  });
  const [dailyData, setDailyData] = useState([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSessions();
  }, [timeFilter]);

  const fetchSessions = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", authUser.id)
      .single();

    let query = supabase
      .from("driver_sessions")
      .select("*")
      .eq("user_id", userData.id)
      .not("end_time", "is", null);

    // Apply time filter
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
    query = query.gte("start_time", date.toISOString());

    const { data, error } = await query.order("start_time", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching sessions:", error);
      return;
    }

    // Transform sessions data
    const transformedSessions = data.map((session) => ({
      id: session.id,
      date: new Date(session.start_time).toLocaleDateString(),
      startTime: new Date(session.start_time).toLocaleTimeString(),
      endTime: new Date(session.end_time).toLocaleTimeString(),
      duration: calculateDuration(session.start_time, session.end_time),
      durationHours: calculateDurationInHours(
        session.start_time,
        session.end_time
      ),
    }));

    setSessions(transformedSessions);
    calculateStats(transformedSessions);
  };

  const calculateStats = (sessionData) => {
    const totalHours = sessionData.reduce(
      (acc, session) => acc + session.durationHours,
      0
    );
    const totalDays = new Set(sessionData.map((session) => session.date)).size;

    // Calculate today's stats
    const today = new Date().toLocaleDateString();
    const todaySessions = sessionData.filter(
      (session) => session.date === today
    );
    const todayHours = todaySessions.reduce(
      (acc, session) => acc + session.durationHours,
      0
    );

    // Calculate daily data for graph
    const dailyMap = sessionData.reduce((acc, session) => {
      const date = session.date;
      acc[date] = (acc[date] || 0) + session.durationHours;
      return acc;
    }, {});

    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    const graphData = last7Days.map((date) => ({
      date: date,
      hours: dailyMap[date] || 0,
    }));

    setDailyData(graphData);

    setStats({
      totalHours: totalHours.toFixed(1),
      averageDaily: totalDays ? (totalHours / totalDays).toFixed(1) : 0,
      longestSession: Math.max(
        ...sessionData.map((session) => session.durationHours)
      ).toFixed(1),
      totalSessions: sessionData.length,
      todayHours: todayHours.toFixed(1),
      todaySessions: todaySessions.length,
    });
  };

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const calculateDurationInHours = (start, end) => {
    return (new Date(end) - new Date(start)) / (1000 * 60 * 60);
  };

  const maxHours = Math.max(...dailyData.map((d) => d.hours));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Time</h1>

      {/* Today's Stats */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Today's Activity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Hours Today</p>
            <p className="text-2xl font-bold">{stats.todayHours}h</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Sessions Today</p>
            <p className="text-2xl font-bold">{stats.todaySessions}</p>
          </div>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Last 7 Days Activity</h2>
        <div className="h-40 flex items-end space-x-2">
          {dailyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{
                  height: `${(day.hours / maxHours) * 100}%`,
                  minHeight: day.hours > 0 ? "4px" : "0",
                }}
              ></div>
              <p className="text-xs text-gray-600 mt-1">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              <p className="text-xs font-medium">{day.hours.toFixed(1)}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Overall Stats</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Total Hours</p>
            <p className="text-2xl font-bold">{stats.totalHours}h</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Daily Average</p>
            <p className="text-2xl font-bold">{stats.averageDaily}h</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Longest Session</p>
            <p className="text-2xl font-bold">{stats.longestSession}h</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Sessions</p>
            <p className="text-2xl font-bold">{stats.totalSessions}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center">
          <label className="text-sm text-gray-600 mr-2">Time Period:</label>
          <select
            className="p-2 border rounded-lg"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.startTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No sessions found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
}
