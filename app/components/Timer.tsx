"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "../styles/Timer.module.css";

// Surge 2026 Opening Date (October 30, 2026 at 00:00:00 IST)
const TARGET_DATE = new Date("2026-10-30T00:00:00+05:30").getTime();
const GLITCH_GLYPHS = ["X", "0", "1", "9", "4", "7", "#", "_", "%", "&"];

export default function Timer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.35 });

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [displayText, setDisplayText] = useState("XX : XX : XX : XX");
  const [isGlitching, setIsGlitching] = useState(true);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Compute live countdown
  useEffect(() => {
    const computeTime = () => {
      const now = new Date().getTime();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d.toString().padStart(2, "0"),
          hours: h.toString().padStart(2, "0"),
          minutes: m.toString().padStart(2, "0"),
          seconds: s.toString().padStart(2, "0"),
        });
      }
    };

    computeTime();
    const interval = setInterval(computeTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const hasAnimatedRef = useRef(false);

  // Cyber glitch reveal sequence triggered ONCE on viewport entry
  useEffect(() => {
    if (!isInView) {
      if (!hasAnimatedRef.current) {
        setDisplayText("XX : XX : XX : XX");
        setIsGlitching(false);
      }
      return;
    }

    if (hasAnimatedRef.current) {
      // Already revealed, ensure displaying live time
      const t = timeLeftRef.current;
      setDisplayText(`${t.days} : ${t.hours} : ${t.minutes} : ${t.seconds}`);
      return;
    }

    hasAnimatedRef.current = true;
    setIsGlitching(true);
    let step = 0;
    const totalSteps = 25;

    const interval = setInterval(() => {
      step++;
      const current = timeLeftRef.current;
      const r = () => GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];

      if (step < 10) {
        // Phase 1: Pure random matrix glitch scramble
        setDisplayText(`${r()}${r()} : ${r()}${r()} : ${r()}${r()} : ${r()}${r()}`);
      } else if (step < totalSteps) {
        // Phase 2: Sequential decryption (Days -> Hours -> Minutes -> Seconds)
        const d = step >= 13 ? current.days : `${r()}${r()}`;
        const h = step >= 17 ? current.hours : `${r()}${r()}`;
        const m = step >= 21 ? current.minutes : `${r()}${r()}`;
        const s = step >= 24 ? current.seconds : `${r()}${r()}`;
        setDisplayText(`${d} : ${h} : ${m} : ${s}`);
      } else {
        // Phase 3: Final lock onto live countdown
        setDisplayText(`${current.days} : ${current.hours} : ${current.minutes} : ${current.seconds}`);
        setIsGlitching(false);
        setHasRevealed(true);
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [isInView]);

  // Keep live display in sync once revealed
  useEffect(() => {
    if (hasRevealed && !isGlitching) {
      setDisplayText(
        `${timeLeft.days} : ${timeLeft.hours} : ${timeLeft.minutes} : ${timeLeft.seconds}`
      );
    }
  }, [timeLeft, hasRevealed, isGlitching]);

  // Click to trigger glitch pulse
  const handleMicroGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 350);
  };

  return (
    <section ref={sectionRef} className={styles.timerSection}>
      <motion.div
        className={styles.timerOverlay}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p
          className={`${styles.timerText} ${isGlitching ? styles.glitching : ""}`}
          onClick={handleMicroGlitch}
          title="Click to glitch"
          style={{ cursor: "pointer" }}
        >
          {displayText}
        </p>

        <div className={styles.timerLabels}>
          <span className={styles.labelItem}>Days</span>
          <span className={styles.labelItem}>Hours</span>
          <span className={styles.labelItem}>Minutes</span>
          <span className={styles.labelItem}>Seconds</span>
        </div>
      </motion.div>
    </section>
  );
}
