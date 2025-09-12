'use client';

import { RefObject } from 'react';
import styles from '../styles/ImageSection.module.css';

interface ImageSectionProps {
  parallaxImageRef: RefObject<HTMLDivElement | null>;
}

export default function ImageSection({ parallaxImageRef }: ImageSectionProps) {
  return (
    <section className={styles.imageSection}>
      <div ref={parallaxImageRef} className={styles.parallaxImage}></div>
    </section>
  );
}