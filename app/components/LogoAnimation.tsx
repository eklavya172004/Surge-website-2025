"use client";

import { useEffect, RefObject } from "react";
import LogoLarge from "./LogoLarge";
import { createFrameScheduler } from "../lib/frameScheduler";

interface LogoAnimationProps {
  logoSmallRef: RefObject<HTMLDivElement | null>;
  logoLargeRef: RefObject<HTMLDivElement | null>;
}

export default function LogoAnimation({ logoSmallRef, logoLargeRef }: LogoAnimationProps) {
  useEffect(() => {
    let width = window.innerWidth, height = window.innerHeight;
    let lastProgress = -1;
    const frames = createFrameScheduler<number>((scrollY) => {
      const logo = logoLargeRef.current;
      if (!logo) return;
      if (width <= 767) {
        // The phone hero scrolls naturally; its navbar has no spare logo slot.
        logo.style.width = "100%";
        logo.style.height = "";
        logo.style.left = "0";
        logo.style.top = "75px";
        logo.dataset.compact = "false";
        if (logoSmallRef.current) logoSmallRef.current.style.opacity = "1";
        return;
      }
      const targetTop = 15, targetWidth = 120, targetHeight = 50;
      const progress = Math.min(1, scrollY / (height * 0.7));
      if (progress === lastProgress) return;
      lastProgress = progress;
      logo.style.width = `${width - (width - targetWidth) * progress}px`;
      logo.style.height = `${height - (height - targetHeight) * progress}px`;
      logo.style.left = `${(width - targetWidth) / 2 * progress}px`;
      logo.style.top = `${Math.max(targetTop, targetTop + 20 - scrollY - 20 * progress)}px`;
      logo.dataset.compact = String(progress >= 0.8);
      if (logoSmallRef.current) logoSmallRef.current.style.opacity = progress >= 0.8 ? "0" : "1";
    }, (callback) => requestAnimationFrame(callback), (id) => cancelAnimationFrame(id));
    const onScroll = () => {
      if (width <= 767 || (lastProgress === 1 && window.scrollY >= height * 0.7)) return;
      frames.schedule(window.scrollY);
    };
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      lastProgress = -1;
      frames.schedule(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      frames.cancel();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [logoSmallRef, logoLargeRef]);

  return <LogoLarge logoLargeRef={logoLargeRef} />;
}
