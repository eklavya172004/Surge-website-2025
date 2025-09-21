'use client';

import { RefObject } from 'react';
import styles from '../styles/LogoLarge.module.css';
import overlayImageSrc from './../../public/Subtract.png';

interface LogoLargeProps {
  logoLargeRef: RefObject<HTMLDivElement | null>;
}

export default function LogoLarge({ logoLargeRef }: LogoLargeProps) {
  return (
    <div 
      ref={logoLargeRef}
      id="logo-large"
      className={styles.logoLarge}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{
        position: 'relative',
        width: '80%',
        height: '80%'
      }}>
        {/* Background video (layer 1 - bottom) */}
        <video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.05)', // Scale up by 5%
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        />
        
        {/* PNG overlay on top (layer 2 - top) */}
        <img
          src="./Subtract.png"
          alt="Logo overlay"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.15)', // Scale up by 15%
            width: '100%',
            height: '100%',
            zIndex: 2,
            objectFit:'fill',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
}