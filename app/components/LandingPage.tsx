'use client';

import { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import LogoLarge from './LogoLarge';
import ImageSection from './ImageSection';
import BallSection from './BlueBall';
import SportsGrid from './SportsGrid';
import Footer from './Footer';

export default function LandingPage() {
  const logoLargeRef = useRef<SVGSVGElement>(null);
  const logoSmallRef = useRef<SVGSVGElement>(null);
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
      const initialTop = navHeight + (viewportHeight - initialHeight) / 2;

      const maxScroll = viewportHeight * 0.7;
      let progress = Math.min(1, scrollY / maxScroll);

      const currentWidth = initialWidth - (initialWidth - targetWidth) * progress;
      const currentHeight = initialHeight - (initialHeight - targetHeight) * progress;
      const currentLeft = initialLeft + (targetLeft - initialLeft) * progress;
      const currentTop = initialTop - scrollY + (targetTop - initialTop) * progress;

      if (logoLargeRef.current) {
        logoLargeRef.current.style.width = `${currentWidth}px`;
        logoLargeRef.current.style.height = `${currentHeight}px`;
        logoLargeRef.current.style.left = `${currentLeft}px`;
        logoLargeRef.current.style.top = `${Math.max(targetTop, currentTop)}px`;
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
    <>
      <Navbar logoSmallRef={logoSmallRef} />
      <HeroSection />
      <BallSection/>
      <ImageSection parallaxImageRef={parallaxImageRef} />
      <LogoLarge logoLargeRef={logoLargeRef} />
      <SportsGrid />
      <Footer />
    </>
  );
}