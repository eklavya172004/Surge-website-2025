'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Handshake, House, LogIn, Mail, MapPin, Menu, X } from 'lucide-react';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  logoSmallRef?: RefObject<HTMLDivElement | null>;
}

const rulebookUrl = 'https://docs.google.com/document/d/1JxvtOm-qu307XSrBc2CChQ40czm685RAAX4sHn98vuM/edit?usp=sharing';
const mobileLinks = [
  { href: '/', label: 'Home', icon: House },
  { href: '/sponsors', label: 'Sponsors', icon: Handshake },
  { href: '/contact', label: 'Contact us', icon: Mail },
  { href: '/#event-map', label: 'Event map', icon: MapPin },
  { href: rulebookUrl, label: 'Rule book', icon: BookOpen, external: true },
];

export default function Navbar({ logoSmallRef }: NavbarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={`${styles.nav} ${menuOpen ? styles.menuOpen : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <ul className={styles.desktopLinks}>
        <li><Link href="/sponsors" aria-current={pathname === '/sponsors' ? 'page' : undefined}>SPONSORS</Link></li>
        <li><Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>HOME</Link></li>
        <li><a href={rulebookUrl} target="_blank" rel="noopener noreferrer">RULE BOOK</a></li>
      </ul>

      <Link href="/" className={styles.logoPlaceholder} aria-label="Surge 2026 home" onClick={closeMenu}>
        <div ref={logoSmallRef} id="logo-small" className={styles.logoContainer}>
          <Image src="/Subtract.svg" alt="" width={104} height={50} className={styles.logoImage} />
        </div>
      </Link>

      <ul className={`${styles.desktopLinks} ${styles.rightLinks}`}>
        <li><Link href="/#event-map" className={styles.mapLink}><MapPin size={15} aria-hidden="true" />MAP</Link></li>
        <li><Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined}>CONTACT</Link></li>
        {status !== 'loading' && !session && (
          <li><Link href="/auth/register" className={styles.primaryLink}>REGISTER</Link></li>
        )}
        <li>
          <Link href={session ? '/dashboard' : '/auth/login'} className={session ? styles.primaryLink : undefined}>
            {session ? 'DASHBOARD' : 'LOGIN'}
          </Link>
        </li>
      </ul>

      <div className={styles.mobileActions}>
        <Link href={session ? '/dashboard' : '/auth/register'} className={styles.primaryLink} onClick={closeMenu}>
          {session ? 'DASHBOARD' : 'REGISTER'}
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span>Menu</span>
        </button>
      </div>

      <div id="mobile-navigation" className={styles.mobilePanel} hidden={!menuOpen}>
        <ul>
          {mobileLinks.map(({ href, label, icon: Icon, external }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={closeMenu}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
                {external && <ArrowUpRight size={16} aria-hidden="true" />}
              </Link>
            </li>
          ))}
        </ul>
        {!session && (
          <Link href="/auth/login" className={styles.mobileLogin} onClick={closeMenu}>
            <LogIn size={20} aria-hidden="true" />Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
