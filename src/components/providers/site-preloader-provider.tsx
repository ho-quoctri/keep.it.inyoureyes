"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Preloader } from "@/components/common/preloader";

type SitePreloaderProviderProps = {
  children: ReactNode;
};

export function SitePreloaderProvider({ children }: SitePreloaderProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleFinishLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      <div className={isLoading ? "site-content site-content--hidden" : "site-content"}>{children}</div>
      {isLoading ? <Preloader finishLoading={handleFinishLoading} /> : null}
    </>
  );
}
