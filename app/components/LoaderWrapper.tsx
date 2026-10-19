"use client";

import { useEffect, useState } from "react";
import TextFlipLoader from "./TextFlipLoader";

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show the flip loader on initial session visit, not on every page transition
    try {
      const hasLoaded = sessionStorage.getItem("surge_has_loaded");
      if (hasLoaded) {
        setLoading(false);
        return;
      }
      sessionStorage.setItem("surge_has_loaded", "true");
    } catch { /* Continue if session storage is unavailable. */ }

    const timer = setTimeout(() => setLoading(false), 1200); 
    return () => clearTimeout(timer);
  }, []);

  return <>
    <div style={{ display: "contents" }} inert={loading} aria-hidden={loading || undefined}>{children}</div>
    {loading && <TextFlipLoader />}
  </>;
}
