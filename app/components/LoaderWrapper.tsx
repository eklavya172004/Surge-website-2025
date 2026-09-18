"use client";

import { useEffect, useState } from "react";
import TextFlipLoader from "./TextFlipLoader";

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show the flip loader on initial session visit, not on every page transition
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("surge_has_loaded");
      if (hasLoaded) {
        setLoading(false);
        return;
      }
      sessionStorage.setItem("surge_has_loaded", "true");
    }

    const timer = setTimeout(() => setLoading(false), 1200); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <TextFlipLoader />;
  }

  return <>{children}</>;
}
