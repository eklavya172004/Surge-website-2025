"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Mail, Building2, Phone, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    if (status === "authenticated" && session) {
      // In a real implementation, this would fetch from the API
      setUserData(session.user);
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="py-8" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-3 border-hsl(190, 70%, 50%) border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!session || !session.user?.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-center">
          <p>You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  const profileFields = [
    {
      icon: User,
      label: "Name",
      value: session.user?.name || "Not provided",
      color: "text-hsl(190, 70%, 50%)"
    },
    {
      icon: Mail,
      label: "Email",
      value: session.user?.email || "Not provided",
      color: "text-hsl(240, 80%, 66%)"
    },
    {
      icon: Building2,
      label: "College",
      value: session.user?.collegeName || "Not provided",
      color: "text-hsl(190, 70%, 50%)"
    },
    {
      icon: Phone,
      label: "Phone",
      value: session.user?.phone || "Not provided",
      color: "text-hsl(279, 80%, 66%)"
    },
    {
      icon: CheckCircle,
      label: "Email Verified",
      value: session.user?.emailVerified ? "Verified" : "Not Verified",
      color: session.user?.emailVerified ? "text-green-500" : "text-red-500"
    }
  ];

  return (
    <div className="py-8" style={{ color: 'hsl(220, 30%, 80%)' }}>
      <h1 className="text-3xl font-mono mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>Profile</h1>
      <p className="mb-8" style={{ color: 'hsl(220, 11%, 35%)' }}>Manage your profile information and account settings</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileFields.map((field, index) => {
          const Icon = field.icon;
          return (
            <div 
              key={index}
              className="p-6 rounded-xl"
              style={{ 
                background: 'hsl(220, 10%, 11%)',
                border: '1px solid hsl(220, 10%, 16%)'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
                  <Icon className={`h-5 w-5 ${field.color}`} />
                </div>
                <div className="flex-1">
                  <dt className="text-sm font-medium mb-1" style={{ color: 'hsl(220, 11%, 35%)' }}>{field.label}</dt>
                  <dd className={`text-lg font-semibold ${field.value === "Not provided" ? "italic" : ""}`}
                      style={{ color: field.value === "Not provided" ? 'hsl(220, 11%, 35%)' : 'hsl(220, 30%, 80%)' }}>
                    {field.value}
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}