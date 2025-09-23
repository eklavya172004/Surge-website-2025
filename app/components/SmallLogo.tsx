'use client';

import { RefObject } from 'react';
import styles from '../styles/Navbar.module.css';
import overlayImageSrc from './../../public/Subtract.png';

interface SmallLogoProps {
  logoSmallRef: RefObject<SVGSVGElement | null>;
}

export default function SmallLogo({ logoSmallRef }: SmallLogoProps) {
  return (
    <div className={styles.logoPlaceholder} style={{ zIndex: 1000 }}>
      <div
        ref={logoSmallRef}
        id="logo-small"
        style={{
          position: 'relative',
          width: '200px',
          height: '50px',
        }}
      >
        {/* Dark blue background (layer 1 - bottom) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#1B263B',
          }}
        />
        {/* PNG outline on top (layer 2 - top) */}
        <img
          src={overlayImageSrc.src}
          alt="Small logo outline"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}