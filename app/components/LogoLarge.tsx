import { RefObject, useState } from "react";
import styles from "../styles/LogoLarge.module.css";
import Image from "next/image";

interface LogoLargeProps {
  logoLargeRef: RefObject<HTMLDivElement | null>;
}

export default function LogoLarge({ logoLargeRef }: LogoLargeProps) {
  // Track when overlay image is loaded
  const [overlayLoaded, setOverlayLoaded] = useState(false);

  return (
    <div
      ref={logoLargeRef}
      id="logo-large"
      className={styles.logoLarge}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80%",
          height: "65%",
        }}
      >
        {/* Load video only after overlay is ready */}
        {overlayLoaded && (
          <video
            src="https://odn56sq2gn.ufs.sh/f/1wdHEmtejGdKHxkVNynKdsRFgkCb8zj7DAiZPqNxYeuvyLl6"
            autoPlay
            loop
            muted
            playsInline
            className={styles.logoVideo} 
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1.1)",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Overlay (triggers video once loaded) */}
        <Image
          src="/Subtract.svg"
          alt="Logo overlay"
          width={800}
          height={600}
          className={styles.logoOverlay}  
          onLoad={() => setOverlayLoaded(true)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1.15)",
            width: "100%",
            height: "100%",
            zIndex: 2,
            objectFit: "fill",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
