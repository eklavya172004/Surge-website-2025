"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import styles from "@/app/styles/PublicPage.module.css";

export default function Sponsors() {
  const titleSponsor = {
    tier: "Title Sponsor",
    name: "HCL Sports",
    url: "https://www.hclcyclothon.com",
    logo: "/sponsors/hcl-sports-transparent-4k.png",
  };

  // Add singular sponsors here with { name, url, logo, tier? }
  const sponsors: { name: string; url: string; logo: string; tier?: string }[] = [
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
      name: "McVitie's",
      tier: "Snacking Partner",
      url: "",
      logo: "/sponsors/mcvities.png",
    },
    {
      name: "Sodexo",
      tier: "Food Partner",
      url: "https://www.sodexo.in/",
      logo: "/sponsors/sodexo.jpg",
    },
    {
      name: "Brwd Beverages",
      url: "",
      logo: "/sponsors/brwd-clean.png",
    },
    {
      name: "Mico",
      url: "",
      logo: "/sponsors/mico.png",
    },
  ];

  const pastSponsors: { name: string; url: string; logo: string }[] = [
    {
      name: "LIMR Recycling",
      url: "https://limrrecycling.com/",
      logo: "/sponsors/limr.png",
    },
    {
      name: "Morde",
      url: "https://www.morde.com/",
      logo: "/sponsors/morde2.png",
    },
    {
      name: "Pladis",
      url: "",
      logo: "/sponsors/pladis.jpg",
    },
    {
      name: "Netweb Technologies",
      url: "https://www.netwebindia.com/",
      logo: "/sponsors/newtab.png",
    },
    {
      name: "PBPartners",
      url: "https://www.pbpartners.com/",
      logo: "/sponsors/pb.png",
    },
    {
      name: "Leap Scholar",
      url: "https://leapscholar.com/",
      logo: "/sponsors/ls.png",
    },
    {
      name: "Vedwell",
      url: "https://www.vedwell.com/",
      logo: "/sponsors/vedwell.png",
    },
    {
      name: "Mico",
      url: "https://micolube.com/",
      logo: "/sponsors/mico.png",
    },
    {
      name: "Zest",
      url: "",
      logo: "/sponsors/zest.jpg",
    },
    {
      name: "Babolat",
      url: "https://www.babolattennis.in/",
      logo: "/sponsors/babolat.jpg",
    },
    {
      name: "Yonex",
      url: "",
      logo: "/sponsors/yonex.jpg",
    },
    {
      name: "ExtraTimeStore",
      url: "",
      logo: "/sponsors/ets.png",
    },
    {
      name: "Coca-Cola",
      url: "https://www.coca-cola.com/in/en",
      logo: "/sponsors/coco.png",
    },
    {
      name: "Sodexo",
      url: "",
      logo: "/sponsors/sodexo.jpg",
    },
    {
      name: "Maggi",
      url: "",
      logo: "/sponsors/maggie.jpg",
    },
    {
      name: "Starbucks",
      url: "",
      logo: "/sponsors/starbucks.jpg",
    },
    {
      name: "SMAAASH",
      url: "",
      logo: "/sponsors/smaaash.png",
    },
    {
      name: "Moi Soi",
      url: "https://ceresfoods.in/",
      logo: "/sponsors/ceres.png",
    },
    {
      name: "FUJIFILM",
      url: "https://global.fujifilm.com/en/",
      logo: "/sponsors/fujifilm.png",
    },
    {
      name: "MYOP",
      url: "https://myop.in/",
      logo: "/sponsors/myop.png",
    },
    {
      name: "EaseMyTrip",
      url: "",
      logo: "/sponsors/emp.png",
    },
    {
      name: "Doyene Sports Club",
      url: "",
      logo: "/sponsors/doyene.jpg",
    },
    {
      name: "Jewels Of Adaa",
      url: "https://www.jewelsofada.com/",
      logo: "/sponsors/joa.png",
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.content}>
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>
            OUR SPONSORS
          </h1>
        </div>
        
        <div className={`${styles.sectionLine} mb-16`} />

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          
          {/* Title Sponsor - occupying 4 tiles */}
          {titleSponsor && (
            <a
              href={titleSponsor.url || undefined}
              target={titleSponsor.url ? "_blank" : undefined}
              rel={titleSponsor.url ? "noopener noreferrer" : undefined}
              className={`${styles.sponsorCard} col-span-1 md:col-span-2 lg:col-span-4 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer`}
            >
              <span className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-4">
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
              className={`${styles.sponsorCard} col-span-1 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer`}
            >
              <div className={`${styles.sponsorLogo} w-full h-48 rounded-lg flex items-center justify-center p-6`}>
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

        {/* Past Sponsors Section */}
        {pastSponsors.length > 0 && (
          <>
            <div className={`${styles.sectionLine} my-16`} />

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>
                PAST SPONSORS
              </h2>
            </div>

            <div className={`${styles.sectionLine} mb-16`} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
              {pastSponsors.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.url || undefined}
                  target={sponsor.url ? "_blank" : undefined}
                  rel={sponsor.url ? "noopener noreferrer" : undefined}
                  className={`${styles.sponsorCard} col-span-1 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer`}
                >
                  <div className={`${styles.sponsorLogo} w-full h-48 rounded-lg flex items-center justify-center p-6`}>
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-white text-xl font-semibold mt-6 text-center">
                    {sponsor.name}
                  </h3>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}