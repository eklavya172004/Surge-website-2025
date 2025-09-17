"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomeClient() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-3xl font-bold">Welcome to Surge</h1>
          
          {session ? (
            <div className="text-center">
              <p className="mb-4 text-gray-600">
                Welcome back, {session.user?.name}!
              </p>
              <div className="space-y-3">
                <Link 
                  href="/dashboard" 
                  className="block w-full rounded-lg bg-blue-600 py-2 text-white text-center hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className="block w-full rounded-lg bg-green-600 py-2 text-white text-center hover:bg-green-700"
                >
                  View Profile
                </Link>
                <Link 
                  href="/api/auth/signout" 
                  className="block w-full rounded-lg bg-gray-600 py-2 text-white text-center hover:bg-gray-700"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link 
                href="/auth/login" 
                className="block w-full rounded-lg bg-blue-600 py-2 text-white text-center hover:bg-blue-700"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="block w-full rounded-lg bg-green-600 py-2 text-white text-center hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}