"use client";

import React from "react";

export default function Sponsors() {
  const sponsors =[
  {
    name: "LIMR recycling",
    url: "https://limrrecycling.com/",
    logo: "/sponsors/limr.png"
  },
  {
    name: "Morde",
    url: "https://www.morde.com/",
    logo: "/sponsors/morde2.png"
  },
    {
    name: "Pladis",
    url: "",
    logo: "/sponsors/pladis.jpg"
  },
  {
    name: "Netweb",
    url: "https://www.netwebindia.com/",
    logo: "/sponsors/newtab.png"
  },
  {
    name: "Policy Bazaar",
    url: "https://www.pbpartners.com/",
    logo: "/sponsors/pb.png"
  },
    {
    name: "leap scholar",
    url: "https://leapscholar.com/",
    logo: "sponsors/ls.png"
  },
  {
    name: "VEDWELL",
    url: "https://www.vedwell.com/",
    logo: "/sponsors/vedwell.png"
  },
    {
    name: "micolube",
    url: "https://micolube.com/",
    logo: "/sponsors/mico.png"
  },
    {
    name: "Zest",
    url: "",
    logo: "/sponsors/zest.jpg"
  },
  {
    name: "Babolat",
    url: "https://www.babolattennis.in/",
    logo: "/sponsors/bb copy.jpg"
  },
  {
    name: "Yonex",
    url: "",
    logo: "/sponsors/yonex.jpg"
  },
  {
    name: "EXTRATIMESTORE",
    url: "",                        // (URL not found/ad ambiguous)
    logo: "/sponsors/ets.png"
  },
    {
    name: "COCA-COLA",
    url: "https://www.coca-cola.com/in/en",
    logo: "/sponsors/coco.png"
  },
  {
    name: "Sodexo",
    url: "",
    logo: "/sponsors/sodexo.jpg"
  },
  {
    name: "Nestle",
    url: "",
    logo: "/sponsors/maggie.jpg"
  },
  {
    name: "Starbucks",
    url: "",
    logo: "/sponsors/starbucks.jpg"
  },
  {
    name: "SMAAASH",
    url: "",                        // (URL not found)
    logo: "/sponsors/smaaash.png"
  },
  {
    name: "Ceres foods",
    url: "",                        // (URL not found)
    logo: "/sponsors/ceres.png"
  },
  {
    name: "FUJIFLM",
    url: "https://global.fujifilm.com/en/",                        
    logo: "/sponsors/fujifilm.png"
  },
  {
    name: "MYOP",
    url: "https://myop.in/",
    logo: "/sponsors/myop.png"
  },
  {
    name: "EASEMYTRIP",
    url: "",                        // (URL not found)
    logo: "/sponsors/emp.png"
  },
  {
    name: "Doyene Sports Club",
    url: "",
    logo: "/sponsors/doyene.jpg"
  },
  {
    name: "Jewels Of Ada",
    url: "https://www.jewelsofada.com/",
    logo: "/sponsors/joa.png"
  }
];

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 md:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        
        .sponsor-card {
          transition: all 0.3s ease;
        }
        
        .sponsor-card:hover {
          transform: translateY(-4px);
        }
        
        .sponsor-logo-wrapper {
          background: rgba(255, 255, 255, 0.95);
          transition: all 0.3s ease;
        }

        .sponsor-card:hover .sponsor-logo-wrapper {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="animated-bg grid-overlay fixed inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>
            OUR SPONSORS
          </h1>
        </div>
        
        <div className="section-line mb-16" />

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:mb-16">
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="sponsor-logo-wrapper w-full h-48 rounded-lg flex items-center justify-center p-6">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-cover"
                />
              </div>
              <h3 className="text-white text-xl font-semibold mt-6 text-center">
                {sponsor.name}
              </h3>
            </a>
          ))}
        </div>

        <div className="section-line mt-16" />

        {/* Footer Text */}
        <div className="text-center mt-12">
          <p className="text-blue-300 text-lg">
            Thank you to our sponsors for their continued support
          </p>
        </div>

      </div>
    </div>
  );
}