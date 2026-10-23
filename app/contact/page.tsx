"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import styles from "@/app/styles/PublicPage.module.css";

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
    <div className={styles.page}>
      <Navbar />

      <div className={styles.content}>
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
        <div className={`${styles.sectionLine} mb-16`} />

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
              <div key={idx} className={`${styles.teamCard} rounded-2xl p-5`}>
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
                  className={`${styles.teamCard} rounded-2xl p-6 flex flex-col ${
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
