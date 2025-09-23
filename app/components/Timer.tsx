"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import timer from "./../../public/Timer.png";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState("00:00:00:00");

  useEffect(() => {
    const targetDate = new Date("2025-11-07T00:00:00").getTime();

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

        // Use normal colon ":" instead of full-width or any fancy char
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
      <div className="absolute inset-0 flex items-center justify-center w-full">
        <p className="text-white text-8xl md:text-9xl lg:text-[12rem] drop-shadow-2xl font-[Anton] flex justify-center">
          {timeLeft.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block w-[1ch] text-center"
              style={{ animation: "tick 1s infinite step-start" }}
            >
              {char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Timer;
