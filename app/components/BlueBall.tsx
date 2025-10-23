import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/BlueBall.module.css";

export default function BlueBall() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBallRef = useRef<HTMLDivElement>(null);
  const rightBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let entryHeight: number;
    let stickyHeight: number;
    let stickyStartY: number;

    const update = () => {
      const container = containerRef.current;
      if (
        !container ||
        !leftBallRef.current ||
        !rightBallRef.current
      )
        return;

      const scrolled = window.pageYOffset - stickyStartY;
      let progress = 0;
      if (scrolled > 0) {
        progress = scrolled / stickyHeight;
        progress = Math.min(1, progress);
      }
      progress = Math.max(0, progress);

      // Ball phases (adjusted for sooner appear/leave)
      const phase1End = 0.15; // Decrease this to appear faster/sooner
      const phase3Start = 0.25; // Decrease this to leave earlier/sooner
      const phase3End = 0.4; // Decrease this to end phase 3 sooner (stays disappeared after)
      let tx_left = 0,
        rot_left = 0,
        tx_right = 0,
        rot_right = 0;
      if (progress <= phase1End) {
        const p1 = progress / phase1End;
        tx_left = -300 * (1 - p1);
        rot_left = -360 * p1;
        tx_right = 300 * (1 - p1);
        rot_right = 360 * p1;
      } else if (progress > phase3Start && progress <= phase3End) {
        const p3 = (progress - phase3Start) / (phase3End - phase3Start);
        tx_left = -300 * p3;
        rot_left = -360 * p3;
        tx_right = 300 * p3;
        rot_right = 360 * p3;
      } else if (progress > phase3End) {
        // Final disappeared state
        tx_left = -300;
        rot_left = -360;
        tx_right = 300;
        rot_right = 360;
      }
      // else: stationary (defaults to 0)

      leftBallRef.current.style.setProperty('--tx', `${tx_left}px`);
      leftBallRef.current.style.setProperty('--rotate', `${rot_left}deg`);
      rightBallRef.current.style.setProperty('--tx', `${tx_right}px`);
      rightBallRef.current.style.setProperty('--rotate', `${rot_right}deg`);

      rafId = null;
    };

    const initDimensions = () => {
      const innerHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      const entryVh = 0.01; // Reduced for sooner start (adjust lower for even earlier)
      const stickyVh = isMobile ? 0.5 : 1.0;
      entryHeight = innerHeight * entryVh;
      stickyHeight = innerHeight * stickyVh;
      const containerOffset = containerRef.current?.offsetTop;
      stickyStartY = (containerOffset || 0) + entryHeight;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    initDimensions();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', initDimensions);
    requestAnimationFrame(update); // Initial

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', initDimensions);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.blueBallContainer}>
      <div className={styles.entrySpacer} />
      <div className={styles.stickyWrapper}>
        {/* Left Ball */}
        <div
          ref={leftBallRef}
          className={`${styles.ball} ${styles.leftBall}`}
        >
          <Image
            src="/blue_ball.svg"
            alt="ball"
            width={600}
            height={600}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Right Ball */}
        <div
          ref={rightBallRef}
          className={`${styles.ball} ${styles.rightBall}`}
        >
          <Image
            src="/blue_ball.svg"
            alt="ball"
            width={600}
            height={600}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            THE THREE-DAY SPORTS FEST OF SNIOE
          </h1>
          <p className={styles.text}>
            {
              '"Where unwavering passion meets rising sports ambitions, Surge\'s 3-day extravaganza invites everyone—athletes and fans alike—into a celebration of realized dreams. From intense tournaments to thrilling one-on-one battles, the event promises a blend of physical and mental challenges where records will be set, shattered, and surpassed."'
            }
          </p>
        </div>
      </div>
    </section>
  );
}