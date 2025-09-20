import { useEffect, useRef } from "react";
import styles from "../styles/BlueBall.module.css";

export default function BlueBall() {
  const animatedElements = useRef<(HTMLElement | null)[]>([]);
  const leftBallRef = useRef<HTMLImageElement | null>(null);
  const rightBallRef = useRef<HTMLImageElement | null>(null);

  // rotation state
  let leftRotation = 0;
  let rightRotation = 0;

  useEffect(() => {
    // Intersection Observer for fade-in
    const elementsToAnimate = animatedElements.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
          } else {
            entry.target.classList.remove(styles.show);
          }
        });
      },
      { threshold: 0.2 }
    );

    elementsToAnimate.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Scroll wheel handler with smoother rotation
    const handleWheel = (e: WheelEvent) => {
      const step = e.deltaY * 0.1; // 🔑 scale down sensitivity

      if (e.deltaY > 0) {
        // scrolling down → rotate LEFT ball
        leftRotation += step;
        if (leftBallRef.current) {
          leftBallRef.current.style.transform = `translateY(-50%) rotate(${leftRotation}deg)`;
        }
      } else if (e.deltaY < 0) {
        // scrolling up → rotate RIGHT ball
        rightRotation += Math.abs(step);
        if (rightBallRef.current) {
          rightBallRef.current.style.transform = `translateY(-50%) rotate(${rightRotation}deg)`;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className={styles.blueBallContainer}>
      {/* Left Ball */}
      <img
        ref={(el) => {
          animatedElements.current[0] = el;
          leftBallRef.current = el;
        }}
        src="/blue_ball.svg"
        alt="ball"
        className={`${styles.ball} ${styles.leftBall} ${styles.animateOnScroll}`}
      />

      {/* Right Ball */}
      <img
        ref={(el) => {
          animatedElements.current[1] = el;
          rightBallRef.current = el;
        }}
        src="/blue_ball.svg"
        alt="ball"
        className={`${styles.ball} ${styles.rightBall} ${styles.animateOnScroll}`}
      />

      <div className={styles.content}>
        <h1
          ref={(el) => (animatedElements.current[2] = el)}
          className={`${styles.title} ${styles.animateOnScroll}`}
        >
          THE THREE-DAY SPORTS FEST OF SNIOE
        </h1>
        <p
          ref={(el) => (animatedElements.current[3] = el)}
          className={`${styles.text} ${styles.animateOnScroll}`}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        
      </div>
    </section>
  );
}
