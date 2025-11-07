import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/BlueBall.module.css";

export default function BlueBall() {
  const leftBallRef = useRef<HTMLDivElement | null>(null);
  const rightBallRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const elements = [
      leftBallRef.current,
      rightBallRef.current,
      titleRef.current,
      textRef.current
    ];

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

    elements.forEach((el) => {
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
      <div 
        ref={leftBallRef} 
        className={`${styles.ball} ${styles.leftBall} ${styles.animateOnScroll}`}
      >
        <Image
          src="/blue_ball.svg"
          alt="ball"
          width={600}
          height={600}
          style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Right Ball */}
      <div 
        ref={rightBallRef} 
        className={`${styles.ball} ${styles.rightBall} ${styles.animateOnScroll}`}
      >
        <Image
          src="/blue_ball.svg"
          alt="ball"
          width={600}
          height={600}
          style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <div className={styles.content}>
        <h1
          className={`${styles.title} ${styles.animateOnScroll}`}
          ref={titleRef}
        >
          THE THREE-DAY SPORTS FEST OF SNIOE
        </h1>
        <p
          className={`${styles.text} ${styles.animateOnScroll}`}
          ref={textRef}
        >
          {
            '"Where unwavering passion meets rising sports ambitions, Surge\'s 3-day extravaganza invites everyone—athletes and fans alike—into a celebration of realized dreams. From intense tournaments to thrilling one-on-one battles, the event promises a blend of physical and mental challenges where records will be set, shattered, and surpassed."'
          }
        </p>

        {/* View Live Scores Section */}
        <a
          href="https://surgescores.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.liveScoresContainer}
        >
          <span className={styles.redDot}></span>
          <span className={styles.liveScoresText}>View Live Scores</span>
        </a>
      </div>
    </section>
  );
}