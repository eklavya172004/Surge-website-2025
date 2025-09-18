import { useEffect, useRef } from "react";
import styles from "../styles/blue_ball.module.css";

export default function BlueBall() {
  const animatedElements = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Collect all elements to animate
    const elementsToAnimate = animatedElements.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
          } else {
            // Optional: Remove the class when the element scrolls out of view.
            // This allows the animation to replay if the user scrolls up.
            entry.target.classList.remove(styles.show);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    elementsToAnimate.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    // Cleanup function: disconnect the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className={styles.blueBallContainer}>
      {/* Left Ball */}
      <img
        src="/blue_ball.svg"
        alt="ball"
        className={`${styles.ball} ${styles.leftBall} ${styles.animateOnScroll}`}
        // Use a ref callback to add the element to our list
        ref={(el) => {animatedElements.current[0] = el}}
      />

      {/* Right Ball */}
      <img
        src="/blue_ball.svg"
        alt="ball"
        className={`${styles.ball} ${styles.rightBall} ${styles.animateOnScroll}`}
        ref={(el) => {animatedElements.current[1] = el}}
      />

      <div className={styles.content}>
        <h1
          className={`${styles.title} ${styles.animateOnScroll}`}
          ref={(el) => {animatedElements.current[2] = el}}
        >
          THE THREE-DAY SPORTS FEST OF SNIOE
        </h1>
        <p
          className={`${styles.text} ${styles.animateOnScroll}`}
          ref={(el) => {animatedElements.current[3] = el}}
        >
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
