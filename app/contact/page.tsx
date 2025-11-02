"use client";

import React from "react";

export default function ContactUs() {
  const coordinators = [
    {
      name: "Ananth",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2M9JoisgAcX7ulQiYq1Rxdg32VGBJ8IsUKrea",
      role: "Chairperson",
      phone: "8870819312",
    },
    {
      name: "Girish Rajendran",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2hy47TfNyQsqOtjE5IKP2A0m17uke8lSLMvUG",
      role: "Co-Chairperson",
      phone: "7418444327",
    },
    {
      name: "Prithviraj Jhunjhunwala",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX21d4qKHeDnkpuaw7tvyVr6PjTJYBgXxFdKc2W",
      role: "Co - Chairperson",
      phone: "+91 6290 742 854",
    },
    {
      name: "Snehil",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX23YzzpEVFJ1wHRbDUz69TQqEoIdgvYsZrhkLO",
      role: "Sports Secretary",
      phone: "9502985728",
    },
    {
      name: "Ashwin Srv",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2F6hktPDBLI6qgx4MEpfAYCG92zhHQVPkBcDj",
      role: "Administrator",
      phone: "8885678388",
    },
    {
      name: "Maahir",
      image:
        "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2nmkIEiFb1vBJtNG7hTcyIAwmde6ofP3aVRM2",
      role: "Administrator",
      phone: "7904732212",
    },
  ];
  
  const leads = [
    {
      category: "PR",
      members: [
        {
          name: "Diggaj Rupani",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX22XEeoSJJZfXuOWqyc1QotwR6EB3vkSCVpD0i",
        },
        {
          name: "Tanisha",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX205SpODGuNLmhHpTJSxBRwQ1K5dXPoeik3MOD",
        },
      ],
    },
    {
      category: "Sponsorship",
      members: [
        {
          name: "Neerav Nagori",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2Vp7v720EbRg1lCYvjia9pN4kfcLseD0B357Z",
        },
        {
          name: "Shanaya Khullar",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2gnZD3skFQqURHN35Ib2X8LOCpAntJehsrcBP",
        },
      ],
    },
    {
      category: "Web Dev",
      members: [
        {
          name: "Shree",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2PIvrmPCXavw4rJT2VcU90bhsYABdyHOFExmC",
        },
        {
          name: "Eklavya",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX23JmUKTVFJ1wHRbDUz69TQqEoIdgvYsZrhkLO",
        },
      ],
    },
    {
      category: "Marketing",
      members: [
        {
          name: "Jai Mishra",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2XWPlqXpybAnvL0VUOphdfsiwMqeEaKB81jtZ",
        },
        {
          name: "Sai Asmita",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2bkqsZt2ZmXIkTzESPNtQ9MGA1YFc0HUK6Jrp",
        },
      ],
    },
    {
      category: "Esports",
      members: [
        {
          name: "Adhityaa R",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2X9qXD4pybAnvL0VUOphdfsiwMqeEaKB81jtZ",
        },
        {
          name: "DEV",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2tkppRRUHXjlPR8cG5zvYBUEswOT2fxn3eoqA",
        },
      ],
    },

    {
      category: "Content",
      members: [
        {
          name: "Antara",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2otlgjX1Ezw2HGg3BrdikMVjJAC4lKemND5YF",
        },
        {
          name: "Sanjith Arun",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2yWosb3fKqQ5dgiIfMuCLcbBztjDrwUZ8xmX0",
        },
      ],
    },
    {
      category: "Videography",
      members: [
        {
          name: "Konda Sreeniketh",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2XAIFZUFpybAnvL0VUOphdfsiwMqeEaKB81jt",
        },
        {
          name: "Nithin",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2fwg9f4YLEyaRjDgnxK1UiOqCSV6rTePuWwt0",
        },
      ],
    },
    {
      category: "Design",
      members: [
        {
          name: "Devanshi Mitruka",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2q7RrAz9BhfsM3dPgWFDOmXiAZpSLT8RJU2Cy",
        },
        {
          name: "Siddh Jain",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX2NT4uYBx9ad3ohUZlbtsBAgHwVCD14q5Kc6Ok",
        },
      ],
    },
    {
      category: "Creative Lead",
      members: [
        {
          name: "Harshita",
          image:
            "https://b092vtsc3q.ufs.sh/f/Uil1Z3Z4arX27TYTFAHwsBUbZNLuP7EWqrYxn6CdoMXVvQte",
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

      <div className="relative z-10 max-w-7xl mx-auto">
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
                    className={`w-full h-full object-cover ${
                      coord.name === "Ashwin Srv" ? "scale-125" : ""
                    }`}
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
