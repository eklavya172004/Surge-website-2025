'use client';

import { RefObject } from 'react';
import styles from '../styles/LogoLarge.module.css';

interface LogoLargeProps {
  logoLargeRef: RefObject<SVGSVGElement | null>;
}

export default function LogoLarge({ logoLargeRef }: LogoLargeProps) {
  return (
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
  );
}