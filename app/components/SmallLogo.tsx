'use client';

import { RefObject } from 'react';
import Image from 'next/image';

interface SmallLogoProps {
  logoSmallRef: RefObject<HTMLDivElement | null>;
}

export default function SmallLogo({ logoSmallRef }: SmallLogoProps) {
  return (
    <div style={{
      width: '300px',
      height: '60px',
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
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
            width: '50%',
            height: '100%',
            backgroundColor: '#1B263B',
            left: 50,
          }}
        />
        {/* PNG outline on top (layer 2 - top) */}
        <Image
          src="/Subtract.png"
          alt="Small logo outline"
          width={200}
          height={50}
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