"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from "next-auth";
import { User, Mail, School, Phone, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileClientPage({
  sessionData,
}: {
  sessionData: Session | null;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const currentSession = sessionData || session;

  // Redirect logic
  useEffect(() => {
    if (status !== "loading" && !currentSession) {
      router.push("/auth/login");
    }

    if (currentSession && !currentSession.user?.emailVerified) {
      router.push("/auth/verify-request");
    }
  }, [currentSession, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="text-gray-600 font-medium">Loading...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentSession || !currentSession.user?.emailVerified) return null;

  const profileFields = [
    {
      icon: User,
      label: "Name",
      value: currentSession.user?.name,
      color: "text-indigo-600",
    },
    {
      icon: Mail,
      label: "Email",
      value: currentSession.user?.email,
      color: "text-purple-600",
    },
    {
      icon: School,
      label: "College",
      value: currentSession.user?.collegeName || "Not provided",
      color: "text-blue-600",
    },
    {
      icon: Phone,
      label: "Phone",
      value: currentSession.user?.phone || "Not provided",
      color: "text-cyan-600",
    },
    {
      icon: CheckCircle,
      label: "Email Verified",
      value: currentSession.user?.emailVerified ? "Verified" : "Not Verified",
      color: currentSession.user?.emailVerified
        ? "text-green-600"
        : "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Your account information
          </p>
        </motion.div>

        {/* Profile Card - Keeping Original Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Profile Header - Original Style */}
          <div className="bg-indigo-600 px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="text-center  sm:text-left">
                <h2 className="text-lg sm:text-2xl font-bold text-white">
                  {currentSession.user?.name}
                </h2>
                <p className="text-sm sm:text-base text-indigo-100">
                  {currentSession.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information - Original Style */}
          <div className="p-3 sm:p-6">
            <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-5 sm:mb-4">
              Account Information
            </h3>

            {/* Mobile Layout - Original */}
            <div className="block  sm:hidden space-y-6">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start py-2 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex mr-2 sm:mr-0 items-center space-x-2">
                      <Icon className={`h-3 w-3 ${field.color}`} />
                      <span className="text-sm text-slate-600">
                        {field.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs break-all sm:break-words font-medium text-right ${
                        field.value === "Not provided"
                          ? "text-slate-400 italic"
                          : "text-slate-800"
                      }`}
                    >
                      {field.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Desktop Layout - Original */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-md shadow-sm">
                        <Icon className={`h-4 w-4 ${field.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <dt className="text-sm font-medium text-slate-600 mb-1">
                          {field.label}
                        </dt>
                        <dd
                          className={`text-base font-medium ${
                            field.value === "Not provided"
                              ? "text-slate-400 italic"
                              : "text-slate-800"
                          } break-words`}
                        >
                          {field.value}
                        </dd>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Badge - Original Style */}
          <div className="px-3 sm:px-6 pb-2 sm:pb-6">

          </div>
        </motion.div>
      </div>
    </div>
  );
}