"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import styles from "../styles/LogoLarge.module.css";

interface LogoLargeProps { logoLargeRef: RefObject<HTMLDivElement | null>; }

export default function LogoLarge({ logoLargeRef }: LogoLargeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(true);
  const [source, setSource] = useState<string>();
  const [videoError, setVideoError] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const chooseSource = () => {
      setVideoError(false);
      setSource(phone.matches ? "/media/surge-hero-mobile.mp4" : "/media/surge-hero.mp4");
    };
    chooseSource();
    phone.addEventListener("change", chooseSource);
    return () => phone.removeEventListener("change", chooseSource);
  }, []);

  useEffect(() => {
    const video = videoRef.current, element = logoLargeRef.current;
    if (!source || !video || !element || videoError) return;
    let active = true;
    const resume = () => {
      if (!visibleRef.current || document.hidden) { video.pause(); return; }
      video.muted = true;
      video.play()?.catch((error: DOMException) => {
        if (active && error.name !== "AbortError" && visibleRef.current && !document.hidden) setNeedsPlay(true);
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      resume();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", resume);
    video.addEventListener("loadeddata", resume);
    resume();
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      video.removeEventListener("loadeddata", resume);
      visibleRef.current = false;
      video.pause();
    };
  }, [source, videoError, logoLargeRef]);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play()?.then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  };

  return <div ref={logoLargeRef} id="logo-large" className={styles.logoLarge}>
    <div className={styles.logoMask}>
      <div className={styles.videoFallback} />
      {!videoError && <video ref={videoRef} src={source} poster="/media/surge-hero-poster.webp"
        autoPlay loop muted playsInline preload="auto" disablePictureInPicture
        onPlaying={() => setNeedsPlay(false)}
        onPause={() => { if (visibleRef.current && !document.hidden) setNeedsPlay(true); }}
        onError={() => setVideoError(true)} className={styles.logoVideo} aria-hidden="true" />}
      <Image src="/Subtract.svg" alt="Surge 2026" width={800} height={600} priority className={styles.logoOverlay} />
    </div>
    {needsPlay && !videoError && <button type="button" className={styles.playButton} onClick={playVideo}><Play size={14} fill="currentColor" aria-hidden="true" /> Play video</button>}
  </div>;
}
