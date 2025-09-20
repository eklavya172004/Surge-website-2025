"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from "next-auth";

export default function ProfileClientPage({ sessionData }: { sessionData: Session | null }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // If we don't have session data, try to get it from the useSession hook
  const currentSession = sessionData || session;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status !== "loading" && !currentSession) {
      router.push("/auth/login");
    }
    
    // Redirect to verification page if not verified
    if (currentSession && !currentSession.user?.emailVerified) {
      router.push("/auth/verify-request");
    }
  }, [currentSession, status, router]);
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!currentSession) {
    return null; // Will redirect to login
  }
  
  if (!currentSession.user?.emailVerified) {
    return null; // Will redirect to verification page
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information
          </p>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
          
          <div className="mt-6">
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentSession.user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentSession.user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">College</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentSession.user?.collegeName || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentSession.user?.rollNumber || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentSession.user?.phone || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Verified</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentSession.user?.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}