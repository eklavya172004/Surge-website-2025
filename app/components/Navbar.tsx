'use client';

import { RefObject } from 'react';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  logoSmallRef: RefObject<SVGSVGElement | null>;
}

export default function Navbar({ logoSmallRef }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>ABOUT</li>
        <li>HOME</li>
        <li>RULE BOOK</li>
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
  );
}