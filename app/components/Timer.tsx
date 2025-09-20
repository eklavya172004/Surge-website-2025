"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import timer from "./../../public/Timer.png";
import { Poppins } from "next/font/google"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"], // pick weights you’ll use
});

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState("00:00:00:00");

  useEffect(() => {
    const targetDate = new Date("2025-11-07T00:00:00").getTime(); // 7 Nov target

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00:00");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days.toString().padStart(2, "0")}:${hours
            .toString()
            .padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-white w-full h-screen">
      {/* Background Image */}
      <Image src={timer} alt="timer" fill priority className="object-cover" />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-white text-7xl md:text-9xl  lg:text-[12rem]  tracking-widest drop-shadow-2xl">
          {timeLeft}
        </p>
      </div>
    </section>
  );
};

export default Timer;
