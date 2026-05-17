"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Preloader } from "@/components/common/preloader";

type SitePreloaderProviderProps = {
  children: ReactNode;
};

type SitePreloaderContextValue = {
  isLoading: boolean;
};

const SitePreloaderContext = createContext<SitePreloaderContextValue | null>(null);

// true after preloader finishes; survives client-side navigations, resets on hard reload
let preloaderDoneThisRuntime = false;

function shouldLoad() {
  // server-side: show preloader in HTML to avoid content flash before hydration
  if (typeof window === "undefined") return true;
  return !preloaderDoneThisRuntime;
}

export function SitePreloaderProvider({ children }: SitePreloaderProviderProps) {
  const [isLoading, setIsLoading] = useState(shouldLoad);
  const [showPreloader, setShowPreloader] = useState(shouldLoad);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contextValue = useMemo(() => ({ isLoading }), [isLoading]);

  const handleFinishLoading = useCallback(() => {
    preloaderDoneThisRuntime = true;
    setIsLoading(false);
    // keep preloader mounted while brand flip + fade animation finishes
    unmountTimerRef.current = setTimeout(() => setShowPreloader(false), 1500);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (unmountTimerRef.current) {
        clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
    };
  }, []);

  return (
    <SitePreloaderContext.Provider value={contextValue}>
      {/* suppressHydrationWarning: intentional SSR/client className difference */}
      <div
        suppressHydrationWarning
        className={isLoading ? "site-content site-content--hidden" : "site-content"}
      >
        {children}
      </div>
      {showPreloader ? <Preloader finishLoading={handleFinishLoading} /> : null}
    </SitePreloaderContext.Provider>
  );
}

export function useSitePreloader() {
  const context = useContext(SitePreloaderContext);

  if (!context) {
    throw new Error("useSitePreloader must be used within SitePreloaderProvider");
  }

  return context;
}
