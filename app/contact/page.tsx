"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";

export default function ContactUs() {
  const coordinators = [
    {
      name: "Prithviraj Jhunjhunwala",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX21d4qKHeDnkpuaw7tvyVr6PjTJYBgXxFdKc2W",
      role: "Chairperson",
      phone: "+91 6290 742 854",
    },
    {
      name: "TBA",
      image: "/placeholder-avatar.svg",
      role: "Co-Chairperson",
      phone: "",
    },
    {
      name: "TBA",
      image: "/placeholder-avatar.svg",
      role: "Sports Secretary",
      phone: "",
    },
    {
      name: "TBA",
      image: "/placeholder-avatar.svg",
      role: "Administrator",
      phone: "",
    },
    {
      name: "TBA",
      image: "/placeholder-avatar.svg",
      role: "Administrator",
      phone: "",
    },
  ];
  
  const leads = [
    {
      category: "PR",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Sponsorship",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Web Dev",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Marketing",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Esports",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Content",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Videography",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Design",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
    {
      category: "Creative Lead",
      members: [
        {
          name: "TBA",
          image: "/placeholder-avatar.svg",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 md:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        
        .animated-bg {
          background: 
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%),
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 197, 253, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(96, 165, 250, 0.06) 0%, transparent 50%);
        }
        
        .grid-overlay {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .card {
          backdrop-filter: blur(12px);
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(147, 197, 253, 0.2);
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-8px);
          border-color: rgba(147, 197, 253, 0.5);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
        }
        
        .section-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        }
      `}</style>

      <div className="animated-bg grid-overlay fixed inset-0" />

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto pt-10">
        <h1
          className="text-6xl md:text-8xl font-bold text-white mb-2 tracking-tight"
          style={{
            fontFamily: "Anton, sans-serif",
            textShadow: "none",
            filter: "none",
          }}
        >
          Meet the Team
        </h1>
        <div className="section-line mb-16" />

        <section className="mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-10"
            style={{
              fontFamily: "Anton, sans-serif",
              textShadow: "none",
              filter: "none",
            }}
          >
            OVERALL COORDINATORS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {coordinators.map((coord, idx) => (
              <div key={idx} className="card rounded-2xl p-5">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-blue-950/30">
                  <img
                    src={coord.image}
                    alt={coord.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-blue-300 mb-1 font-medium">
                  {coord.role}
                </p>
                <h3 className="text-lg font-bold text-white mb-2">
                  {coord.name}
                </h3>
                {coord.phone && (
                  <a
                    href={`tel:+91${coord.phone}`}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    +91 {coord.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-10"
            style={{
              fontFamily: "Anton, sans-serif",
              textShadow: "none",
              filter: "none",
            }}
          >
            THE LEADS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leads.map((group, idx) => (
              <div key={idx} className="card rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  {group.category}
                </h3>
                <div
                  className={`grid ${
                    group.members.length === 1
                      ? "grid-cols-1 max-w-[200px] mx-auto"
                      : "grid-cols-2"
                  } gap-4`}
                >
                  {group.members.map((member, mIdx) => (
                    <div key={mIdx} className="group cursor-pointer">
                      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-blue-950/30 transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-base font-semibold text-white text-center">
                        {member.name}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
