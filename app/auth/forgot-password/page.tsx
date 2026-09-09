"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage(
          data.message ||
            "If an account with that email exists, a password reset link has been sent to your inbox."
        );
      } else {
        setError(data.message || "Failed to process request. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/login/loginbg.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-[#00308F]/40 to-[#0643A5]/50 backdrop-blur-[2px]" />

      {/* Glow shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#0C56BC]/20 to-[#2140A3]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#2140A3]/20 to-[#0643A5]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 relative">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-900 mb-6 transition-colors group"
          >
            <span className="mr-1.5 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00308F] via-[#0643A5] to-[#2140A3] bg-clip-text text-transparent mb-2">
              Forgot Password
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#0C56BC] to-[#2140A3] rounded-full mb-3" />
            <p className="text-gray-600 text-sm">
              Enter your registered email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-lg text-sm flex items-start">
              <span className="mr-2 text-base">✓</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-lg text-sm flex items-start">
              <span className="mr-2 text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 bg-gradient-to-r from-[#0C56BC] via-[#2140A3] to-[#00308F] hover:from-[#0643A5] text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-600 text-xs">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-blue-700 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
