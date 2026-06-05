"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Preloader } from "@/components/common/preloader";
import { IMAGES } from "@/lib/images";
import { MENU } from "@/constants/menu";

type SitePreloaderProviderProps = {
  children: ReactNode;
};

type SitePreloaderContextValue = {
  isLoading: boolean;
};

const SitePreloaderContext = createContext<SitePreloaderContextValue | null>(null);

const CRITICAL_IMAGE_ASSETS = [
  "/images/gallery/image-1.webp",
  MENU[0]?.thumbnail,
  IMAGES.eyes.slide,
].filter(Boolean) as string[];

const CRITICAL_VIDEO_ASSETS = ["/videos/myself-video.webm"];
const PRELOAD_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | void> {
  return Promise.race([
    promise,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
}

function preloadImageAsset(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    const settle = () => resolve();

    image.onload = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => undefined).finally(settle);
        return;
      }

      settle();
    };

    image.onerror = settle;
    image.src = src;

    if (image.complete) {
      settle();
    }
  });
}

function preloadVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let settled = false;

    const settle = () => {
      if (settled) return;
      settled = true;
      video.removeAttribute("src");
      video.load();
      resolve();
    };

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = settle;
    video.onerror = settle;
    video.src = src;

    if (video.readyState >= 1) {
      settle();
    }
  });
}

function preloadCriticalAssets(): Promise<void> {
  const imageTasks = CRITICAL_IMAGE_ASSETS.map((src) => preloadImageAsset(src));
  const videoTasks = CRITICAL_VIDEO_ASSETS.map((src) => preloadVideoMetadata(src));

  return Promise.all([...imageTasks, ...videoTasks]).then(() => undefined);
}

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
  const [canFinishPreloader, setCanFinishPreloader] = useState(() => !shouldLoad());
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
    if (!isLoading) return;

    let cancelled = false;

    withTimeout(preloadCriticalAssets(), PRELOAD_TIMEOUT_MS).finally(() => {
      if (!cancelled) {
        setCanFinishPreloader(true);
      }
    });

    return () => {
      cancelled = true;
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
      {showPreloader ? <Preloader canFinish={canFinishPreloader} finishLoading={handleFinishLoading} /> : null}
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
