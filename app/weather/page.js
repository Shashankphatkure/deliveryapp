"use client";
import { useState } from "react";

export default function WeatherAlerts() {
  const [selectedRegion, setSelectedRegion] = useState("all");

  const alerts = {
    weather: [
      {
        id: 1,
        type: "Heavy Rain",
        severity: "high",
        time: "Now",
        description:
          "Heavy rainfall expected in Mumbai region. Exercise caution while driving.",
        affectedAreas: ["Andheri", "Bandra", "Juhu"],
        precautions: [
          "Use headlights",
          "Maintain safe distance",
          "Reduce speed",
          "Avoid flooded areas",
        ],
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 11l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>
        ),
      },
      {
        id: 2,
        type: "High Temperature",
        severity: "medium",
        time: "12:00 PM - 4:00 PM",
        description: "Temperature expected to reach 38°C. Stay hydrated.",
        affectedAreas: ["All Regions"],
        precautions: [
          "Carry water",
          "Take breaks in shade",
          "Use AC when needed",
        ],
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      },
    ],
    safety: [
      {
        id: 3,
        type: "Road Construction",
        severity: "medium",
        time: "Ongoing",
        description:
          "Major road work on Western Express Highway. Expect delays.",
        affectedAreas: ["Goregaon", "Malad"],
        precautions: [
          "Plan alternate routes",
          "Follow diversions",
          "Allow extra time",
        ],
        icon: (
          <svg
            className="w-6 h-6"
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
        ),
      },
      {
        id: 4,
        type: "Public Event",
        severity: "low",
        time: "5:00 PM - 10:00 PM",
        description:
          "Large gathering expected near Stadium. Traffic congestion likely.",
        affectedAreas: ["Churchgate", "Marine Lines"],
        precautions: [
          "Avoid area if possible",
          "Use alternate routes",
          "Start early",
        ],
        icon: (
          <svg
            className="w-6 h-6"
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
        ),
      },
    ],
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIconBackground = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather & Safety Alerts</h1>

      {/* Current Conditions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Current Conditions</h2>
            <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">32°C</p>
            <p className="text-sm text-gray-600">Partly Cloudy</p>
          </div>
        </div>
      </div>

      {/* Region Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm text-gray-600 mb-2">
          Select Region
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="all">All Regions</option>
          <option value="north">North Mumbai</option>
          <option value="south">South Mumbai</option>
          <option value="east">East Mumbai</option>
          <option value="west">West Mumbai</option>
        </select>
      </div>

      {/* Active Alerts */}
      <div className="space-y-6">
        {/* Weather Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Weather Alerts</h2>
          </div>
          <div className="divide-y">
            {alerts.weather.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full ${getIconBackground(
                      alert.severity
                    )} flex items-center justify-center mr-4`}
                  >
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{alert.type}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity.charAt(0).toUpperCase() +
                          alert.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Time:</span> {alert.time}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Affected Areas:</span>{" "}
                      {alert.affectedAreas.join(", ")}
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Precautions:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {alert.precautions.map((precaution, index) => (
                          <li key={index}>{precaution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Safety Alerts</h2>
          </div>
          <div className="divide-y">
            {alerts.safety.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full ${getIconBackground(
                      alert.severity
                    )} flex items-center justify-center mr-4`}
                  >
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{alert.type}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity.charAt(0).toUpperCase() +
                          alert.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Time:</span> {alert.time}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Affected Areas:</span>{" "}
                      {alert.affectedAreas.join(", ")}
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Precautions:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {alert.precautions.map((precaution, index) => (
                          <li key={index}>{precaution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
