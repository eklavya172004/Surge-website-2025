"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An error occurred during authentication";
  const message = searchParams.get("message") || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-red-500">Authentication Error</h1>
        
        <p className="mb-4 text-center text-gray-600">
          {message || error}
        </p>
        
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}