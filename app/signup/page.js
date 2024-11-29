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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Add success animation
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
      <div className="hidden lg:flex lg:w-1/2 bg-lime-50 flex-col justify-center px-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Journey with{" "}
              <span className="text-lime-600">Equico</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Join our community of successful users and start your 14-day free
              trial
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Trial</h3>
                <p className="text-gray-600">
                  Try all features free for 14 days, no credit card required
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Easy Setup</h3>
                <p className="text-gray-600">
                  Get started in minutes with our guided onboarding
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
                <p className="text-gray-600">
                  Join thousands of satisfied users worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="pt-8 border-t border-gray-200">
            <div className="italic text-gray-600 mb-4">
              "This platform has transformed how we work. Highly recommended!"
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">Jane Smith</div>
                <div className="text-sm text-gray-500">CEO at TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full space-y-8 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 transition-transform duration-300 ease-in-out hover:scale-105">
              Join Us Today
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-lime-600 hover:text-lime-500 transition-all duration-300 ease-in-out hover:underline"
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
              <div className="bg-red-50 p-4 rounded-xl text-red-500 border border-red-100 animate-fadeIn">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-50 p-4 rounded-xl text-green-500 border border-green-100 animate-fadeIn">
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
                    <span className="text-lime-500">✓</span>
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
                      : "bg-lime-600 hover:bg-lime-700"
                  } 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 
                  disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]`}
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
            By signing up, you agree to our{" "}
            <a href="#" className="text-lime-600 hover:text-lime-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-lime-600 hover:text-lime-500">
              Privacy Policy
            </a>
          </div>

          {/* Social Sign-up Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
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

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S15.523 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

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
