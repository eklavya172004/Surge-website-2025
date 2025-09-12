'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function Home() {
  const logoLargeRef = useRef<SVGSVGElement>(null);
  const logoSmallRef = useRef<SVGSVGElement>(null);
  const parallaxImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateAnimation = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const navHeight = 80;
      const targetWidth = 200; // Target width for logo-big after animation
      const targetHeight = 50; // Target height for logo-big after animation
      const targetTop = (navHeight - targetHeight) / 2;
      const targetLeft = (viewportWidth - targetWidth) / 2;

      const initialWidth = viewportWidth * 0.8; // Initial larger width
      const initialHeight = initialWidth * (300 / 1200); // Initial larger height
      const initialLeft = viewportWidth * 0.1; // Initial left position
      const initialTop = navHeight + (viewportHeight - initialHeight) / 2;

      const maxScroll = viewportHeight * 0.7; // Adjust max scroll to complete earlier
      let progress = Math.min(1, scrollY / maxScroll);

      // Adjust scaling to ensure overlap
      const currentWidth = initialWidth - (initialWidth - targetWidth) * progress;
      const currentHeight = initialHeight - (initialHeight - targetHeight) * progress;
      const currentLeft = initialLeft + (targetLeft - initialLeft) * progress;
      const currentTop = initialTop - scrollY + (targetTop - initialTop) * progress;

      if (logoLargeRef.current) {
        logoLargeRef.current.style.width = `${currentWidth}px`;
        logoLargeRef.current.style.height = `${currentHeight}px`;
        logoLargeRef.current.style.left = `${currentLeft}px`;
        logoLargeRef.current.style.top = `${Math.max(targetTop, currentTop)}px`;
      }

      if (logoSmallRef.current) {
        // Hide logo-small more aggressively as logo-large scales down
        logoSmallRef.current.style.opacity = progress >= 0.8 ? '0' : '1'; // Start hiding earlier
      }

      if (parallaxImageRef.current) {
        const parallaxSpeed = 0.3;
        const parallaxOffset = -scrollY * parallaxSpeed;
        parallaxImageRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener('scroll', updateAnimation);
    window.addEventListener('resize', updateAnimation);
    updateAnimation();

    return () => {
      window.removeEventListener('scroll', updateAnimation);
      window.removeEventListener('resize', updateAnimation);
    };
  }, []);

  return (
    <>
      <nav className={styles.nav}>
        <ul>
          <li>ABOUT</li>
          <li>SCHEDULE</li>
          <li>VENUES</li>
        </ul>
        <div className={styles.logoPlaceholder}>
          <svg
            ref={logoSmallRef}
            id="logo-small"
            width="200"
            height="50"
            viewBox="0 0 200 50"
            className={styles.logoSmall}
          >
            <text x="100" y="25" textAnchor="middle" fill="navy" fontSize="30" fontWeight="bold">
              SURGE
            </text>
            <text x="100" y="40" textAnchor="middle" fill="navy" fontSize="10" fontWeight="bold">
              2025
            </text>
          </svg>
        </div>
        <ul>
          <li>NEWS</li>
          <li>CONTACT</li>
          <li>FIFA</li>
          <li>SHOP</li>
        </ul>
      </nav>
      <div className={styles.heroContainer}></div>
      <section className={styles.imageSection}>
        <div
          ref={parallaxImageRef}
          className={styles.parallaxImage}
        ></div>
      </section>
      <svg
        ref={logoLargeRef}
        id="logo-large"
        width="80%"
        height="auto"
        viewBox="0 0 1200 300"
        className={styles.logoLarge}
      >
        <mask id="text-mask">
          <rect width="1200" height="300" fill="black" />
          <text x="600" y="180" textAnchor="middle" fill="white" fontSize="200" fontWeight="bold">
            SURGE
          </text>
          <text x="600" y="270" textAnchor="middle" fill="white" fontSize="30" fontWeight="bold">
            2025
          </text>
        </mask>
        <foreignObject width="1200" height="300" mask="url(#text-mask)">
          <video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          ></video>
        </foreignObject>
      </svg>
    </>
  );
}