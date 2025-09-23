'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from '../styles/Navbar.module.css';

export default function RightNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLoginClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <ul className={styles.navList} style={{ zIndex: 1200 }}>
      <li className={styles.navItem}>CONTACT</li>
      <li className={styles.navItem}>FIFA</li>
      <li className={styles.navItem}>SHOP</li>
      <li className={styles.navItem} onClick={handleLoginClick}>LOGIN</li>
    </ul>
  );
}