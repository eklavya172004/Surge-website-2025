"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";

export default function Sponsors() {
  const titleSponsor = {
    tier: "Title Sponsor",
    name: "HCL Sports",
    url: "https://www.hclsports.com",
    logo: "/sponsors/hcl-sports-transparent-4k.png",
  };

  // Add singular sponsors here with { name, url, logo, tier? }
  const sponsors: { name: string; url: string; logo: string; tier?: string }[] = [
    {
      name: "Mico",
      url: "",
      logo: "/sponsors/mico.png",
    },
    {
      name: "Nutrica",
      tier: "Nutrition Partner",
      url: "",
      logo: "/sponsors/nutrica.png",
    },
    {
      name: "Fateh",
      tier: "Study Abroad Partner",
      url: "",
      logo: "/sponsors/fateh.png",
    },
    {
      name: "Powerade",
      tier: "Hydration Partner",
      url: "",
      logo: "/sponsors/powerade.png",
    },
    {
      name: "Brwd Beverages",
      url: "",
      logo: "/sponsors/brwd-clean.png",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 md:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        
        .sponsor-card {
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .sponsor-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
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

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto pt-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>
            OUR SPONSORS
          </h1>
        </div>
        
        <div className="section-line mb-16" />

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          
          {/* Title Sponsor - occupying 4 tiles */}
          {titleSponsor && (
            <a
              href={titleSponsor.url || undefined}
              target={titleSponsor.url ? "_blank" : undefined}
              rel={titleSponsor.url ? "noopener noreferrer" : undefined}
              className="sponsor-card col-span-1 md:col-span-2 lg:col-span-4 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-4">
                {titleSponsor.tier}
              </span>
              <div className="w-full max-w-md h-28 sm:h-32 flex items-center justify-center p-2">
                <img
                  src={titleSponsor.logo}
                  alt={titleSponsor.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-white text-xl font-semibold mt-4 text-center">
                {titleSponsor.name}
              </h3>
            </a>
          )}

          {/* Singular Sponsor Tiles (1 tile each) */}
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url || undefined}
              target={sponsor.url ? "_blank" : undefined}
              rel={sponsor.url ? "noopener noreferrer" : undefined}
              className="sponsor-card col-span-1 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="sponsor-logo-wrapper w-full h-48 rounded-lg flex items-center justify-center p-6">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-white text-xl font-semibold mt-6 text-center">
                {sponsor.name}
              </h3>
              {sponsor.tier && (
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium mt-1 text-center">
                  {sponsor.tier}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}