'use client';

import styles from '../styles/Navbar.module.css';

export default function LeftNavbar() {
  const rulebookUrl = "https://docs.google.com/document/d/1asukNIo8Kfx_qK9IzvarUcNpbX2Wn9TszDawgh17Jh4/preview";
  
  const handleRulebookClick = () => {
    window.open(rulebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <ul className={styles.navList} style={{ zIndex: 1100 }}>
      <li className={styles.navItem}>ABOUT</li>
      <li className={styles.navItem}>HOME</li>
      <li 
        className={`${styles.navItem} ${styles.externalLink}`}
        onClick={handleRulebookClick}
      >
        RULE BOOK
      </li>
    </ul>
  );
}