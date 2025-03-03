"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const supabase = createClientComponentClient();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Create user record in users table
      const { error: userError } = await supabase.from("users").insert([
        {
          email: email,
          auth_id: authData.user.id,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      if (userError) throw userError;

      // Success handling
      setLoading("success");
      setTimeout(() => {
        setMessage("Check your email for the confirmation link!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.message);
      // Shake animation on error
      const form = document.querySelector("form");
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
    } finally {
      if (error) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Benefits/Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-50 flex-col justify-center px-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join <span className="text-blue-600">Fruit Affairs</span> Delivery
            </h1>
            <p className="text-gray-600 text-lg">
              Start delivering fresh fruits and earning with us today
            </p>
          </div>

          <div className="space-y-8">
            {/* Benefit Items */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Competitive Earnings
                </h3>
                <p className="text-gray-600">
                  Earn up to ₹1000 per day with flexible hours
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Flexible Schedule
                </h3>
                <p className="text-gray-600">
                  Choose your own hours and delivery areas
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Dedicated Support
                </h3>
                <p className="text-gray-600">
                  24/7 support team to help you succeed
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="pt-8 border-t border-gray-200">
            <div className="italic text-gray-600 mb-4">
              "I love the flexibility and earnings with Fruit Affairs. Great
              platform for delivery partners!"
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">Rahul Kumar</div>
                <div className="text-sm text-gray-500">
                  Delivery Partner since 2023
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Become a Delivery Partner
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                sign in to your account
              </Link>
            </p>
          </div>
          <form
            className={`mt-8 space-y-6 transition-all duration-300 ${
              loading === "success" ? "opacity-50" : ""
            }`}
            onSubmit={handleSignUp}
          >
            {error && (
              <div className="bg-red-50 p-4 rounded-xl text-red-500 border border-red-100">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-50 p-4 rounded-xl text-green-500 border border-green-100">
                {message}
              </div>
            )}
            <div className="rounded-xl shadow-sm -space-y-px relative">
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className={`appearance-none rounded-t-xl relative block w-full px-3 py-2 border ${
                    focusedInput === "email"
                      ? "border-blue-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
                <div
                  className={`absolute right-3 top-2 transition-all duration-300 ${
                    email ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  {email && email.includes("@") && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  className={`appearance-none rounded-b-xl relative block w-full px-3 py-2 border ${
                    focusedInput === "password"
                      ? "border-blue-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300`}
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <div
                  className={`absolute right-3 top-2 transition-all duration-300 ${
                    password ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  {password && password.length >= 6 && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white
                  ${
                    loading === "success"
                      ? "bg-green-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  } 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === "success" ? (
                  "Account created!"
                ) : loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          {/* Add terms and privacy notice */}
          <div className="text-sm text-gray-500 text-center mt-4">
            By signing up, you agree to Fruit Affairs'{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
