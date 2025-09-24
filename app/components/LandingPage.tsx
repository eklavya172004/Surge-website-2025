'use client';

import { useEffect, useRef } from 'react';
import LeftNavbar from './LeftNavbar';
import RightNavbar from './RightNavbar';
import SmallLogo from './SmallLogo';
import HeroSection from './HeroSection';
import LogoLarge from './LogoLarge';
import BallSection from './BlueBall';
import SportsGrid from './SportsGrid';
import Footer from './Footer';
import Timer from './Timer';

export default function LandingPage() {
  const logoLargeRef = useRef<HTMLDivElement>(null);
  const logoSmallRef = useRef<HTMLDivElement>(null);
  const parallaxImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateAnimation = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const navHeight = 80;
      const targetWidth = 200;
      const targetHeight = 50;
      const targetTop = (navHeight - targetHeight) / 2;
      const targetLeft = (viewportWidth - targetWidth) / 2;

      const initialWidth = viewportWidth * 0.8;
      const initialHeight = initialWidth * (300 / 1200);
      const initialLeft = viewportWidth * 0.1;
      const initialTop = targetTop + 10; // Shifted down by 10px from the target

      const maxScroll = viewportHeight * 0.7;
      const progress = Math.min(1, scrollY / maxScroll);

      const currentWidth = initialWidth - (initialWidth - targetWidth) * progress;
      const currentHeight = initialHeight - (initialHeight - targetHeight) * progress;
      const currentLeft = initialLeft + (targetLeft - initialLeft) * progress;
      const currentTop = initialTop - scrollY + (targetTop - initialTop) * progress;

      if (logoLargeRef.current) {
        logoLargeRef.current.style.width = `${currentWidth}px`;
        logoLargeRef.current.style.height = `${currentHeight}px`;
        logoLargeRef.current.style.left = `${currentLeft}px`;
        logoLargeRef.current.style.top = `${Math.max(targetTop, currentTop)}px`;
        logoLargeRef.current.style.zIndex = '1050';
      }

      if (logoSmallRef.current) {
        logoSmallRef.current.style.opacity = progress >= 0.8 ? '0' : '1';
      }

      if (parallaxImageRef.current) {
        const parallaxSpeed = 0.3;
        const parallaxOffset = -scrollY * parallaxSpeed;
        parallaxImageRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener('scroll', updateAnimation);
    window.addEventListener('resize', updateAnimation);
    updateAnimation();

    return () => {
      window.removeEventListener('scroll', updateAnimation);
      window.removeEventListener('resize', updateAnimation);
    };
  }, []);

  return (
    <div style={{ background: 'white' }}>
      <nav >
        <LeftNavbar />
        <SmallLogo logoSmallRef={logoSmallRef} />
        <RightNavbar />
      </nav>
      <HeroSection />
      <BallSection />
      <LogoLarge logoLargeRef={logoLargeRef} />
      <SportsGrid />
      <Timer />
      <Footer />
    </div>
  );
}