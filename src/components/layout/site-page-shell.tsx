'use client';

import type { ReactNode } from "react";
import { BrandName } from "@/components/common/brand-name";
import { useRouter } from "next/navigation";


type SitePageShellProps = {
  children: ReactNode;
};

export function SitePageShell({ children }: SitePageShellProps) {
  const router = useRouter();

  return (
    <div className="relative h-screen overflow-hidden transform isolate">
      <div className="fixed top-10 right-10 z-50" onClick={() => router.push("/")}>
        <BrandName />
      </div>
      <p className="text-sm fixed bottom-6 left-10 z-50">
        &copy; {new Date().getFullYear()} - keep.it.iNyourEyes
      </p>
      <div id="site-content-scroll" className="h-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}