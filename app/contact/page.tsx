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
      name: "Avi Popli",
      image: "/team/sports-secretary.jpg",
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
      name: "Somanshu Rajnish",
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
          name: "Veda Rana",
          image: "/team/pr-veda.jpg",
        },
        {
          name: "Riddhi Jain",
          image: "/team/pr-riddhi.jpg",
        },
        {
          name: "Lakshay Mahajan",
          image: "/team/pr-lakshya.jpg",
        },
      ],
    },
    {
      category: "Sponsorship",
      members: [
        {
          name: "Thanikachalam Lakshmanan",
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
          name: "Shreyansh Jain",
          image: "/team/marketing-shreyansh.jpg",
        },
        {
          name: "Anshika Bagra",
          image: "/team/marketing-anshikha.jpg",
        },
        {
          name: "Mrinmayee Gorakati",
          image: "/team/marketing-lead-3.jpg",
        },
      ],
    },
    {
      category: "Esports",
      members: [
        {
          name: "S Rohit Kumar",
          image: "/team/esports-rohit.jpg",
        },
        {
          name: "Sanjith Arun",
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
          name: "Anushka Dey",
          image: "/team/design-lead-1.jpg",
        },
        {
          name: "Sai Asmita",
          image: "/team/design-lead-2.jpg",
        },
      ],
    },
    {
      category: "Accommodation",
      members: [
        {
          name: "Adarsh Chetri",
          image: "/team/accommodation-1.jpg",
        },
        {
          name: "Anvitha Juvadi",
          image: "/team/accommodation-2.jpg",
        },
        {
          name: "Ayesha Hussain",
          image: "/team/accommodation-3.jpg",
        },
        {
          name: "Shekhar",
          image: "/team/accommodation-4.jpg",
        },
      ],
    },
    {
      category: "Hospitality",
      members: [
        {
          name: "Gaurav Krishna Mishra",
          image: "/team/hospitality-1.jpg",
        },
        {
          name: "Hasini Patnayakuni",
          image: "/team/hospitality-2.jpg",
        },
        {
          name: "Yatharth Mittal",
          image: "/team/hospitality-3.jpg",
        },
      ],
    },
    {
      category: "Security",
      members: [
        {
          name: "Srihari Veerasamy V M",
          image: "/team/security-1.jpg",
        },
        {
          name: "Hanshika",
          image: "/team/security-2.jpg",
        },
      ],
    },
    {
      category: "Logistics",
      members: [
        {
          name: "Neerav Nagori",
          image: "/team/logistics-1.jpg",
        },
        {
          name: "Laasya D Sudhakar",
          image: "/team/logistics-2.jpg",
        },
        {
          name: "Arsavin Tandel",
          image: "/team/logistics-3.jpg",
        },
      ],
    },
    {
      category: "Production",
      members: [
        {
          name: "Sanav Khullar",
          image: "/team/production-1.jpg",
        },
        {
          name: "Budhil",
          image: "/team/production-2.jpg",
        },
      ],
    },
    {
      category: "Decor",
      members: [
        {
          name: "Anandita Yadav",
          image: "/team/decor-1.jpg",
        },
        {
          name: "Saina Malik",
          image: "/team/decor-2.jpg",
        },
      ],
    },
    {
      category: "Event Management",
      members: [
        {
          name: "Arsh Bhasin",
          image: "/team/event-management-1.jpg",
        },
      ],
    },
    {
      category: "Transport",
      members: [
        {
          name: "Vaibhav Sharma",
          image: "/team/transport-1.jpg",
        },
      ],
    },
    {
      category: "Head of Operations",
      members: [
        {
          name: "Arnav Punia",
          image: "/team/head-of-operations-1.jpg",
        },
        {
          name: "Krishna Dubey",
          image: "/team/head-of-operations-2.jpg",
        },
        {
          name: "Namritaa Ramesh Kumar",
          image: "/team/head-of-operations-3.jpg",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {leads.map((group, idx) => {
              // On desktop 6-col grid (3 visual columns of span 2):
              // If there are 2 cards in the final row (e.g. 11 items), center them by starting the first at col 2
              const isFirstOfTwoOnDesktop = idx === leads.length - 2 && leads.length % 3 === 2;
              // If there is 1 solitary card in the final row (e.g. 10 items), center it at col 3 (or col 2 of 3)
              const isLastSingleOnDesktop = idx === leads.length - 1 && leads.length % 3 === 1;
              // On tablet 2-col grid, if the last item is alone in its row, center it across both columns
              const isLastSingleOnTablet = idx === leads.length - 1 && leads.length % 2 === 1;
              return (
                <div
                  key={idx}
                  className={`${styles.teamCard} rounded-2xl p-6 flex flex-col col-span-1 md:col-span-1 lg:col-span-2 ${
                    isFirstOfTwoOnDesktop ? "lg:col-start-2" : ""
                  } ${
                    isLastSingleOnDesktop ? "lg:col-start-3" : ""
                  } ${
                    isLastSingleOnTablet
                      ? "md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:max-w-none lg:mx-0"
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
                          : group.members.length === 4
                          ? "grid-cols-4 gap-2 sm:gap-2.5"
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
                              group.members.length === 4
                                ? "text-xs"
                                : group.members.length === 3
                                ? "text-sm"
                                : "text-base"
                            } font-semibold text-white text-center leading-tight`}
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
