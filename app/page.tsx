"use client";

import { useRef } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BlueBall from "./components/BlueBall";
import SportsGrid from "./components/SportsGrid";
import Timer from "./components/Timer";
import Footer from "./components/Footer";
import LogoAnimation from "./components/LogoAnimation";
import Map from "./components/Map";


export default function HomePage() {
  const logoSmallRef = useRef<HTMLDivElement>(null);
  const logoLargeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white">
      <Navbar logoSmallRef={logoSmallRef} />
      <HeroSection/>
      <BlueBall/>
      <LogoAnimation  logoSmallRef={logoSmallRef} logoLargeRef={logoLargeRef} />
      <SportsGrid/>
      <Timer />
      <Map/>
      <Footer />
    </div>
  );
}
