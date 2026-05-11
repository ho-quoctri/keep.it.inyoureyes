"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Preloader } from "@/components/common/preloader";

type SitePreloaderProviderProps = {
  children: ReactNode;
};

let hasShownPreloaderInDocument = false;

export function SitePreloaderProvider({ children }: SitePreloaderProviderProps) {
  const [isLoading, setIsLoading] = useState(() => !hasShownPreloaderInDocument);
  const [showPreloader, setShowPreloader] = useState(() => !hasShownPreloaderInDocument);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFinishLoading = useCallback(() => {
    hasShownPreloaderInDocument = true;
    setIsLoading(false);
    // keep preloader mounted for 1.5s so brand fade animation finishes before unmount
    unmountTimerRef.current = setTimeout(() => setShowPreloader(false), 1500);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";

    return () => {
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      <div className={isLoading ? "site-content site-content--hidden" : "site-content"}>{children}</div>
      {showPreloader ? <Preloader finishLoading={handleFinishLoading} /> : null}
    </>
  );
}
