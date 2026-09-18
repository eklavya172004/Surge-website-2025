"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Missing reset token or email. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          newPassword: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login?message=Password reset successful. You can now log in.");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password. Link may have expired.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
        <p className="text-gray-600 text-sm mb-6">
          This password reset link is invalid or incomplete.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block py-3 px-6 bg-[#0C56BC] text-white rounded-xl font-bold text-sm hover:bg-[#00308F] transition-colors"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 relative">
      <Link
        href="/auth/login"
        className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-900 mb-6 transition-colors group"
      >
        <span className="mr-1.5 transform group-hover:-translate-x-1 transition-transform">←</span>
        Back to Login
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00308F] via-[#0643A5] to-[#2140A3] bg-clip-text text-transparent mb-2">
          New Password
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-[#0C56BC] to-[#2140A3] rounded-full mb-3" />
        <p className="text-gray-600 text-sm">
          Resetting password for <strong className="text-gray-800">{email}</strong>
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-lg text-sm flex items-center">
          <span className="mr-2 text-base">✓</span>
          <span>Password reset successfully! Redirecting to login...</span>
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
          <label className="block text-gray-700 text-sm font-semibold mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1.5">
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className={`w-full py-3.5 px-6 bg-gradient-to-r from-[#0C56BC] via-[#2140A3] to-[#00308F] hover:from-[#0643A5] text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg ${
            loading || success ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating password..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="bg-white p-8 rounded-3xl text-center text-gray-600">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
