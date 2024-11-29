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
  const [error, setError] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

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

      // Get the redirectTo parameter from the URL
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo") || "/";

      // Redirect to the original destination or default to /demoprofile
      router.push(redirectTo);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Benefits/Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-lime-50 flex-col justify-center px-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-lime-600">Equico</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Join thousands of users who trust us for their needs
            </p>
          </div>

          <div className="space-y-8">
            {/* Benefit Items */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-lime-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-lime-600"
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
                <h3 className="font-semibold text-gray-900 mb-1">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Experience blazing fast performance and reliability
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-lime-600"
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
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Get help whenever you need it with our dedicated support
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Trusted by leading companies</p>
            <div className="flex space-x-6 items-center">
              <div className="text-gray-400 font-semibold">Company 1</div>
              <div className="text-gray-400 font-semibold">Company 2</div>
              <div className="text-gray-400 font-semibold">Company 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full space-y-8 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 transition-transform duration-300 ease-in-out hover:scale-105">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/signup"
                className="font-medium text-lime-600 hover:text-lime-500 transition-all duration-300 ease-in-out hover:underline"
              >
                start your 14-day free trial
              </Link>
            </p>
          </div>

          {/* Existing form code */}
          <form
            className={`mt-8 space-y-6 transition-all duration-300 ${
              loading === "success" ? "opacity-50" : ""
            }`}
            onSubmit={handleSignIn}
          >
            {error && (
              <div className="bg-red-50 p-4 rounded-xl text-red-500 border border-red-100 animate-fadeIn">
                {error}
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
                      ? "border-lime-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-lime-500 focus:border-lime-500 focus:z-10 sm:text-sm transition-all duration-300`}
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
                    <span className="text-lime-500">✓</span>
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
                      ? "border-lime-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-lime-500 focus:border-lime-500 focus:z-10 sm:text-sm transition-all duration-300`}
                  placeholder="Password"
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
                    <span className="text-lime-500">✓</span>
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
                  className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-lime-600 hover:text-lime-500"
                >
                  Forgot your password?
                </a>
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
                      : "bg-lime-600 hover:bg-lime-700"
                  } 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 
                  disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]`}
              >
                {loading === "success" ? (
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

          {/* Social Sign-in Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing style jsx global */}
      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
