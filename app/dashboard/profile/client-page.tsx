"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { User, Mail, School, Hash, Phone, CheckCircle, Edit3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileClientPage({ sessionData }: { sessionData: Session | null }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [animate, setAnimate] = useState(false);
  
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
    
    // Trigger animations after component mounts
    if (status === "authenticated" && currentSession) {
      setAnimate(true);
    }
  }, [currentSession, status, router]);
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
      color: "text-indigo-600"
    },
    {
      icon: Mail,
      label: "Email",
      value: currentSession.user?.email,
      color: "text-purple-600"
    },
    {
      icon: School,
      label: "College",
      value: currentSession.user?.collegeName || "Not provided",
      color: "text-blue-600"
    },
    
    {
      icon: Phone,
      label: "Phone",
      value: currentSession.user?.phone || "Not provided",
      color: "text-cyan-600"
    },
    {
      icon: CheckCircle,
      label: "Email Verified",
      value: currentSession.user?.emailVerified ? "Verified" : "Not Verified",
      color: currentSession.user?.emailVerified ? "text-green-600" : "text-red-600"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-slate-600">
            Manage your profile information and account settings
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
        >
          <Edit3 className="h-4 w-4" />
          <span>Edit Profile</span>
        </motion.button>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden relative"
      >
        {/* Decorative gradient elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 px-8 py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
            >
              <User className="h-12 w-12 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white"
              >
                {currentSession.user?.name}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-indigo-100 mt-1"
              >
                {currentSession.user?.email}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-8">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Account Information
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl p-6 border border-indigo-100/50 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-white/50">
                      <Icon className={`h-5 w-5 ${field.color}`} />
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-slate-600 mb-1">{field.label}</dt>
                      <dd className={`text-lg font-semibold ${field.value === "Not provided" ? "text-slate-400 italic" : "text-slate-800"}`}>
                        {field.value}
                      </dd>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Status Badge */}
        <div className="px-8 pb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              currentSession.user?.emailVerified 
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200" 
                : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            <CheckCircle className={`h-4 w-4 ${
              currentSession.user?.emailVerified ? "text-green-600" : "text-yellow-600"
            }`} />
            <span>
              {currentSession.user?.emailVerified ? "Account Verified" : "Verification Pending"}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}