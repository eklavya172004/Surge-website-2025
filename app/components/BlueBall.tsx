import { useEffect, useRef } from "react";
import styles from "../styles/BlueBall.module.css";

export default function BlueBall() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBallRef = useRef<HTMLImageElement>(null);
  const rightBallRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const updateAnimation = () => {
      if (
        !containerRef.current ||
        !leftBallRef.current ||
        !rightBallRef.current ||
        !titleRef.current ||
        !textRef.current
      )
        return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) when the container is in view
      const scrollProgress = Math.min(
        Math.max(
          (windowHeight - rect.top) / (windowHeight + rect.height),
          0
        ),
        1
      );

      // Phase 1: 0% to 50% - move inward and rotate to ±180deg
      // Phase 2: 50% to 100% - move outward and rotate to ±360deg
      let leftTranslateX, rightTranslateX, leftRotation, rightRotation;

      if (scrollProgress <= 0.5) {
        // Phase 1: Moving inward
        const phaseProgress = scrollProgress / 0.5; // Normalize to 0-1 for phase 1
        leftTranslateX = 200 * phaseProgress; // 0 to 200px
        rightTranslateX = -200 * phaseProgress; // 0 to -200px
        leftRotation = 180 * phaseProgress; // 0 to 180deg
        rightRotation = -180 * phaseProgress; // 0 to -180deg
      } else {
        // Phase 2: Moving outward
        const phaseProgress = (scrollProgress - 0.5) / 0.5; // Normalize to 0-1 for phase 2
        leftTranslateX = 200 - 1000 * phaseProgress; // 200px to -800px
        rightTranslateX = -200 + 1000 * phaseProgress; // -200px to 800px
        leftRotation = 180 + 180 * phaseProgress; // 180deg to 360deg
        rightRotation = -180 - 180 * phaseProgress; // -180deg to -360deg
      }

      // Content animation: simple translateY
      const contentTranslateY = 50 * (1 - scrollProgress); // 50px to 0px

      // Update ball styles
      leftBallRef.current.style.transform = `translateY(-50%) translateX(${leftTranslateX}px) rotate(${leftRotation}deg)`;
      rightBallRef.current.style.transform = `translateY(-50%) translateX(${rightTranslateX}px) rotate(${rightRotation}deg)`;

      // Update content styles
      titleRef.current.style.transform = `translateY(${contentTranslateY}px)`;
      textRef.current.style.transform = `translateY(${contentTranslateY}px)`;
    };

    // Add scroll event listener
    window.addEventListener("scroll", updateAnimation);

    // Run once on mount to set initial styles
    updateAnimation();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", updateAnimation);
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.blueBallContainer}>
      {/* Left Ball */}
      <img
        ref={leftBallRef}
        src="/blue_ball.svg"
        alt="ball"
        className={`${styles.ball} ${styles.leftBall}`}
      />

      {/* Right Ball */}
      <img
        ref={rightBallRef}
        src="/blue_ball.svg"
        alt="ball"
        className={`${styles.ball} ${styles.rightBall}`}
      />

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          THE THREE-DAY SPORTS FEST OF SNIOE
        </h1>
        <p ref={textRef} className={styles.text}>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
      </div>
    </section>
  );
}