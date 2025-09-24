"use client";

import { useEffect, useRef } from "react";

const sports = ["#BADMINTON", "#CRICKET", "#FOOTBALL", "#VOLLEYBALL", "#CHESS"];

export default function TextFlipLoader() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    let isActive = true;
    const texts = textRefs.current;

    // Initial setup
    if (texts[0]) {
      texts[0].style.top = "0";
      texts[0].style.transform = "translateY(0)";
    }

    const animate = () => {
      if (!isActive) return;

      const currentText = texts[currentIndex];
      const nextIndex = (currentIndex + 1) % texts.length;
      const nextText = texts[nextIndex];

      if (!currentText || !nextText) return;

      // Move current text up and out
      currentText.style.transition = "transform 0.5s ease";
      currentText.style.transform = "translateY(-100%)";

      // Move next text into view
      nextText.style.transition = "none";
      nextText.style.transform = "translateY(100%)";
      nextText.style.top = "0";
      setTimeout(() => {
        if (!isActive) return;
        nextText.style.transition = "transform 0.5s ease";
        nextText.style.transform = "translateY(0)";
      }, 50);

      // Reset current text position after animation
      setTimeout(() => {
        if (!isActive) return;
        currentText.style.transition = "none";
        currentText.style.transform = "translateY(100%)";
        currentText.style.top = "100%";
      }, 500);

      currentIndex = nextIndex;
      setTimeout(animate, 1000); // Repeat after 1s (0.5s animation + 0.5s pause)
    };

    // Start animation after initial 0.5s
    const initialTimeout = setTimeout(animate, 500);

    return () => {
      isActive = false;
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "700px",
          height: "100px",
          position: "relative",
          overflow: "hidden",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
      >
        {sports.map((sport, index) => (
          <div
            key={sport}
            ref={(el) => {
              textRefs.current[index] = el;
            }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
              fontFamily: "Anton",
              top: "100%",
              color: index % 2 === 0 ? "#404040" : "#808080",
              fontWeight: "bold",
              border: "none",
              outline: "none",
            }}
          >
            {sport}
          </div>
        ))}
      </div>
    </div>
  );
}