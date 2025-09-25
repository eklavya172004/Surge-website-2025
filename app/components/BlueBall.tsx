import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/BlueBall.module.css";

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
      },
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
      <Image
        src="/blue_ball.svg"
        alt="ball"
        width={100}
        height={100}
        className={`${styles.ball} ${styles.leftBall} ${styles.animateOnScroll}`}
        // Use a ref callback to add the element to our list
        ref={(el) => {
          animatedElements.current[0] = el;
        }}
      />

      {/* Right Ball */}
      <Image
        src="/blue_ball.svg"
        alt="ball"
        width={100}
        height={100}
        className={`${styles.ball} ${styles.rightBall} ${styles.animateOnScroll}`}
        ref={(el) => {
          animatedElements.current[1] = el;
        }}
      />

      <div className={styles.content}>
        <h1
          className={`${styles.title} ${styles.animateOnScroll}`}
          ref={(el) => {
            animatedElements.current[2] = el;
          }}
        >
          THE THREE-DAY SPORTS FEST OF SNIOE
        </h1>
        <p
          className={`${styles.text} ${styles.animateOnScroll}`}
          ref={(el) => {
            animatedElements.current[3] = el;
          }}
        >
          {
            '"Where unwavering passion meets rising sports ambitions, Surge\'s 3-day extravaganza invites everyone—athletes and fans alike—into a celebration of realized dreams. From intense tournaments to thrilling one-on-one battles, the event promises a blend of physical and mental challenges where records will be set, shattered, and surpassed."'
          }
        </p>
      </div>
    </section>
  );
}
