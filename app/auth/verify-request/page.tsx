"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyRequestPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setMessage("Verification email resent successfully. Please check your inbox.");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to resend verification email.");
      }
    } catch {
      setMessage("An error occurred while resending the email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Check Your Email</h1>
        
        <p className="mb-4 text-center text-gray-600">
          We&apos;ve sent a verification link to <strong>{email || "your email"}</strong>.
          Please check your inbox and click the link to verify your account.
        </p>
        
        <p className="mb-6 text-center text-sm text-gray-500">
          Didn&apos;t receive the email? Check your spam folder or click below to resend.
        </p>
        
        {message && (
          <p className={`mb-4 text-center text-sm ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        
        <button
          onClick={handleResend}
          disabled={isResending || !email}
          className="w-full rounded-lg bg-yellow-500 py-2 text-white hover:bg-yellow-600 disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend Verification Email"}
        </button>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}