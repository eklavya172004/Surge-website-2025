"use client";

import React from "react";

export default function Sponsors() {
  const sponsors = [
    {
      name: "Blue Tokai Coffee",
      url: "https://bluetokaicoffee.com/?srsltid=AfmBOoprc30US3d7mK2viawyvZ6swREykqh3IIyF5lr6DGADVhpETbzn",
      logo: "/sponsors/blueTicTac.png"
    },
    {
      name: "Netweb",
      url: "https://www.netwebindia.com/",
    },
    {
        name: "Policy Bazaar",
        url: "https://www.policybazaar.com/?pb_source=google_brand&pb_medium=ppc&pb_term=Policy%20bazaar&pb_campaign=Policy_Bazaar_Tier_100Brand_19jun&gad_source=1&gad_campaignid=20813880917&gbraid=0AAAAADwVZjJtqP_r8TLbxxXaNLhTO6XyK&gclid=Cj0KCQjw35bIBhDqARIsAGjd-cadMBgnAsNHnHnZLEBdibthiWhjjdXk1Y_3ktUG7lk6YtT3zaXfnL8aAoogEALw_wcB",
        logo: ""
    },
    {
        name: "pbpartners",
        url: "https://www.pbpartners.com/",
        logo: "/sponsors/newtab.png"
    },
    {
        name:"Babolat",
        url: "https://www.babolattennis.in/",
        logo: "/path/to/babolatlogo.png"
    },
    {
        name:"leap scholar",
        url:"https://leapscholar.com/",
        logo:""
    },
    {
        name:"micolube",
        url:"https://micolube.com/",
        logo:""
    },
    {
        name:"LIMR recycling",
        url:"",
        logo:""
    },
    {
        name:"Jewels Of Ada",
        url:"https://www.jewelsofada.com/",
        logo:""
    },
    {
        name:"VEDWELL",
        url:"",
        logo:""
    },
    {
        name:"MORDE",
        url:"",
        logo:""
    },
    {
        name:"COCA-COLA",
        url:"",
        logo:""
    },
    {
        name:"MYOP",
        url:"",
        logo:""
    },
    {
        name:"FUJIFLM",
        url:"",
        logo:""
    },
    {
        name:"SMAAASH",
        url:"",
        logo:""
    },
    {
        name:"EASEMYTRIP",
        url:"",
        logo:""
    },
    {
        name:"EXTRATIMESTORE",
        url:"",
        logo:""
    },
    {
        name:"Ceres foods",
        url:"",
        logo:""
    },
    {
        name:"Morde",
        url:"",
        logo:""
    }
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

        .sponsor-logo-wrapper {
          background: rgba(255, 255, 255, 0.95);
          transition: all 0.3s ease;
        }

        .card:hover .sponsor-logo-wrapper {
          background: rgba(255, 255, 255, 1);
        }
      `}</style>

      <div className="animated-bg grid-overlay fixed inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>
            OUR SPONSORS
          </h1>
          <p className="text-xl text-blue-200">
            Powered by excellence
          </p>
        </div>
        
        <div className="section-line mb-16" />

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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