"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from "next-auth";

export default function ProfileClientPage({ sessionData }: { sessionData: Session | null }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
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
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center">
        <div className="text-white text-lg font-medium">Loading...</div>
      </div>
    );
  }
  
  if (!currentSession || !currentSession.user?.emailVerified) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br  text-gray-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-gray-300">
          Manage your profile information
        </p>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="p-6 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
          
          <div className="mt-6">
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Name</dt>
                <dd className="mt-1 text-sm text-white">{currentSession.user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-white">{currentSession.user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">College</dt>
                <dd className="mt-1 text-sm text-white">{currentSession.user?.collegeName || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Roll Number</dt>
                <dd className="mt-1 text-sm text-white">{currentSession.user?.rollNumber || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Phone</dt>
                <dd className="mt-1 text-sm text-white">{currentSession.user?.phone || "Not provided"}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Verified</dt>
                <dd className="mt-1 text-sm text-white">
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
