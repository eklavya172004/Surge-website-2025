'use client';

import { RefObject } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from '../styles/Navbar.module.css';
import overlayImageSrc from './../../public/Subtract.png';

interface NavbarProps {
  logoSmallRef: RefObject<SVGSVGElement | null>;
}

export default function Navbar({ logoSmallRef }: NavbarProps) {
  const rulebookUrl = "https://docs.google.com/document/d/1asukNIo8Kfx_qK9IzvarUcNpbX2Wn9TszDawgh17Jh4/preview";
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleRulebookClick = () => {
    window.open(rulebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLoginClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <nav className={styles.nav}>
      <ul style={{ position: 'relative', zIndex: 1300 }}>
        <li>ABOUT</li>
        <li>HOME</li>
        <li 
          className={styles.externalLink}
          onClick={handleRulebookClick}
        >
          RULE BOOK
        </li>
      </ul>
      <div className={styles.logoPlaceholder} style={{ position: 'relative', zIndex: 1100 }}>
        <div
          ref={logoSmallRef}
          id="logo-small"
          style={{
            position: 'relative',
            width: '200px',
            height: '50px',
            left: '40px',
          }}
        >
          {/* Dark blue background (layer 1 - bottom) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 50,
              width: '50%',
              height: '100%',
              backgroundColor: '#1B263B', // Dark blue/marine color
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
      <ul style={{ position: 'relative', zIndex: 1100 }}>
        <li>CONTACT</li>
        <li>FIFA</li>
        <li>SHOP</li>
        <li onClick={handleLoginClick}>LOGIN</li>
      </ul>
    </nav>
  );
}