"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClientComponentClient();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Get the redirectTo parameter from the URL
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo") || "/";

      // Redirect to the original destination or default to home
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000); // Small delay to show success state
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Benefits/Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-50 flex-col justify-center px-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back to{" "}
              <span className="text-blue-600">Fruit Affairs</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Continue your journey as a delivery partner
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
                  Daily Earnings
                </h3>
                <p className="text-gray-600">
                  Get paid daily for your deliveries
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Choose Your Area
                </h3>
                <p className="text-gray-600">
                  Deliver in your preferred locations
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
                  Partner Support
                </h3>
                <p className="text-gray-600">
                  24/7 assistance for our delivery partners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your delivery account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                register as a new delivery partner
              </Link>
            </p>
          </div>

          {/* Existing form code */}
          <form
            className={`mt-8 space-y-6 transition-all duration-300 ${
              success ? "opacity-50" : ""
            }`}
            onSubmit={handleSignIn}
          >
            {error && (
              <div className="bg-red-50 p-4 rounded-xl text-red-500 border border-red-100">
                {error}
              </div>
            )}
            
            {success && !error && (
              <div className="bg-green-50 p-4 rounded-xl text-green-600 border border-green-100">
                {password ? "Login successful! Redirecting..." : "Password reset link sent to your email. Please check your inbox."}
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
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none rounded-b-xl relative block w-full px-3 py-2 border ${
                    focusedInput === "password"
                      ? "border-blue-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <div
                  className={`absolute right-10 top-2 transition-all duration-300 ${
                    password ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  {password && password.length >= 6 && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white
                  ${
                    success
                      ? "bg-green-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  } 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {success ? (
                  "Success! Redirecting..."
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
