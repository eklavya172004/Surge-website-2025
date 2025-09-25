'use client';

import { RefObject } from 'react';
import styles from '../styles/LogoLarge.module.css';
import Image from 'next/image';

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
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{
        position: 'relative',
        width: '80%',
        height: '65%'
      }}>
        {/* Background video (layer 1 - bottom) */}
        <video
          src="https://odn56sq2gn.ufs.sh/f/1wdHEmtejGdKHxkVNynKdsRFgkCb8zj7DAiZPqNxYeuvyLl6"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.1)', // Scale up by 5%
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* PNG overlay on top (layer 2 - top) */}
        <Image
          src="/Subtract.png"
          alt="Logo overlay"
          width={800}
          height={600}
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