"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from "next-auth";
import { User, Mail, School, Hash, Phone, CheckCircle, Edit3 } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-700 text-lg font-medium">Loading profile...</div>
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
      color: "text-blue-600"
    },
    {
      icon: Mail,
      label: "Email",
      value: currentSession.user?.email,
      color: "text-green-600"
    },
    {
      icon: School,
      label: "College",
      value: currentSession.user?.collegeName || "Not provided",
      color: "text-purple-600"
    },
    {
      icon: Hash,
      label: "Roll Number",
      value: currentSession.user?.rollNumber || "Not provided",
      color: "text-orange-600"
    },
    {
      icon: Phone,
      label: "Phone",
      value: currentSession.user?.phone || "Not provided",
      color: "text-indigo-600"
    },
    {
      icon: CheckCircle,
      label: "Email Verified",
      value: currentSession.user?.emailVerified ? "Verified" : "Not Verified",
      color: currentSession.user?.emailVerified ? "text-green-600" : "text-red-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile</h1>
          <p className="text-slate-600">
            Manage your profile information and account settings
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium">
          <Edit3 className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentSession.user?.name}</h2>
              <p className="text-blue-100">{currentSession.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Icon className={`h-5 w-5 ${field.color}`} />
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-slate-600 mb-1">{field.label}</dt>
                      <dd className={`text-lg font-semibold ${field.value === "Not provided" ? "text-slate-400 italic" : "text-slate-800"}`}>
                        {field.value}
                      </dd>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Badge */}
        <div className="px-8 pb-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
            currentSession.user?.emailVerified 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }`}>
            <CheckCircle className={`h-4 w-4 ${
              currentSession.user?.emailVerified ? "text-green-600" : "text-yellow-600"
            }`} />
            <span>
              {currentSession.user?.emailVerified ? "Account Verified" : "Verification Pending"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}