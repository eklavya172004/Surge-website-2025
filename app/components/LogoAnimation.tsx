"use client";

import { useEffect, useRef, RefObject } from "react";
import LogoLarge from "./LogoLarge";

export default function LogoAnimation({ 
  logoSmallRef,
  logoLargeRef,
}: {  
  logoSmallRef: RefObject<SVGSVGElement | null>;
  logoLargeRef: RefObject<SVGSVGElement | null>;  
}) {
  const parallaxImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateAnimation = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const navHeight = 80;
      const targetWidth = 120;
      const targetHeight = 50;
      const targetTop = (navHeight - targetHeight) / 2;
      const targetLeft = (viewportWidth - targetWidth) / 2;

      // Start with full viewport dimensions
      const initialWidth = viewportWidth;
      const initialHeight = viewportHeight;
      const initialLeft = 0;
      const initialTop = targetTop + 20; // Shifted down by 10px from the target

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
        logoSmallRef.current.style.opacity = progress >= 0.8 ? "0" : "1";
      }

      if (parallaxImageRef.current) {
        const parallaxSpeed = 0.3;
        const parallaxOffset = -scrollY * parallaxSpeed;
        parallaxImageRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener("scroll", updateAnimation);
    window.addEventListener("resize", updateAnimation);
    updateAnimation();

    return () => {
      window.removeEventListener("scroll", updateAnimation);
      window.removeEventListener("resize", updateAnimation);
    };
  }, [logoSmallRef, logoLargeRef]);

  return <LogoLarge logoLargeRef={logoLargeRef} />;
}