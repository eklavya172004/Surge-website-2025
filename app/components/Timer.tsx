"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/Timer.module.css";

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
    <section className={styles.timerSection}>
      {/* Overlay Content */}
      <div className={styles.timerOverlay}>
        <p className={styles.timerText}>
          {timeLeft.split('').map((char, index) => (
            <span
              key={index}
              className={styles.timerDigit}
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
