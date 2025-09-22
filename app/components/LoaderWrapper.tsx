"use client";

import { useEffect, useState } from "react";
import TextFlipLoader from "./TextFlipLoader";
// import TextFlipLoader from "@/components/TextFlipLoader";

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace timeout with real loading logic if needed
    const timer = setTimeout(() => setLoading(false), 4000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <TextFlipLoader />;
  }

  return <>{children}</>;
}
