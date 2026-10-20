"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";

export default function ContactUs() {
  const coordinators = [
    {
      name: "Prithviraj Jhunjhunwala",
      image: "/team/chairperson.jpg",
      role: "Chairperson",
      phone: "+91 6290 742 854",
    },
    {
      name: "Saksham Dhawan",
      image: "/team/co-chairperson.jpg",
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
      name: "Shanaya Khullar",
      image: "/team/administrator-shanaya.jpg",
      role: "Administrator",
      phone: "",
    },
    {
      name: "Appy",
      image: "/team/administrator-appy.jpg",
      role: "Administrator",
      phone: "",
    },
    {
      name: "Diggaj Rupani",
      image: "/team/director-outreach.jpg",
      role: "Director Of Outreach",
      phone: "",
    },
    {
      name: "Girish Rajendran",
      image: "/team/advisor.jpg",
      role: "Advisor",
      phone: "",
    },
  ];
  
  const leads = [
    {
      category: "PR",
      members: [
        {
          name: "Veda",
          image: "/team/pr-veda.jpg",
        },
        {
          name: "Riddhi",
          image: "/team/pr-riddhi.jpg",
        },
        {
          name: "Lakshya",
          image: "/team/pr-lakshya.jpg",
        },
      ],
    },
    {
      category: "Sponsorship",
      members: [
        {
          name: "Thanikachalam",
          image: "/team/sponsorship-thanikachalam.jpg",
        },
      ],
    },
    {
      category: "Dev",
      members: [
        {
          name: "Om Tiwari",
          image: "/team/dev-om.jpg",
        },
        {
          name: "Kolla Aniketh",
          image: "/team/dev-aniketh.jpg",
        },
      ],
    },
    {
      category: "Marketing",
      members: [
        {
          name: "Shreyansh",
          image: "/team/marketing-shreyansh.jpg",
        },
        {
          name: "Anshikha",
          image: "/team/marketing-anshikha.jpg",
        },
      ],
    },
    {
      category: "Esports",
      members: [
        {
          name: "Rohit",
          image: "/team/esports-rohit.jpg",
        },
        {
          name: "Sanjith",
          image: "/team/esports-sanjith.jpg",
        },
      ],
    },
    {
      category: "Content",
      members: [
        {
          name: "Samyukta Menon",
          image: "/team/content-samyukta.jpg",
        },
        {
          name: "Abhinav Anoop",
          image: "/team/content-abhinav.jpg",
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
                    href={`tel:${coord.phone.startsWith("+") ? coord.phone.replace(/\s+/g, "") : `+91${coord.phone.replace(/\s+/g, "")}`}`}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {coord.phone.startsWith("+91") ? coord.phone : `+91 ${coord.phone}`}
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
            {leads.map((group, idx) => {
              const isLastSingle = idx === leads.length - 1 && leads.length % 3 === 1;
              return (
                <div
                  key={idx}
                  className={`card rounded-2xl p-6 flex flex-col ${
                    isLastSingle
                      ? "md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:col-span-1 lg:col-start-2 lg:max-w-none"
                      : ""
                  }`}
                >
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    {group.category}
                  </h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div
                      className={`grid ${
                        group.members.length === 1
                          ? "grid-cols-1 max-w-[200px] mx-auto gap-4"
                          : group.members.length === 3
                          ? "grid-cols-3 gap-2.5 sm:gap-3"
                          : "grid-cols-2 gap-4"
                      }`}
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
                          <h4
                            className={`${
                              group.members.length === 3 ? "text-sm" : "text-base"
                            } font-semibold text-white text-center`}
                          >
                            {member.name}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
