"use client";

import { useProtectedRoute } from "@/lib/client-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardClientPage() {
  const { isAuthenticated, isVerified, loading } = useProtectedRoute(true);
  const { data: session } = useSession();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">You must be logged in to view this page.</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Please verify your email to access this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome, {session?.user?.name}! You are successfully logged in and verified.
              </p>
            </div>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Protected Content</h2>
          <p className="text-gray-600">
            This content is only accessible to authenticated and verified users.
          </p>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800">User Information</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Verified</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session?.user?.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}