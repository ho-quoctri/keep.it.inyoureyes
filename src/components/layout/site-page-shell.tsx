/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, type ReactNode } from "react";
import { BrandName } from "@/components/common/brand-name";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";


type SitePageShellProps = {
  children: ReactNode;
  currentYear: number;
};

export function SitePageShell({ children, currentYear }: SitePageShellProps) {
  const router = useRouter();
  const rawPathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = mounted ? rawPathname : "/";


  return (
    <div className="relative h-screen overflow-hidden transform isolate">
      <div className="fixed top-10 md:top-10 right-4 md:right-10 z-50" onClick={() => router.push("/")}>
        <BrandName />
      </div>
      <p className="text-sm fixed bottom-6 left-10 z-50">
        &copy; {currentYear} - keep.it.iNyourEyes
      </p>
      <div className="flex flex-col text-right items-end text-lg lg:text-xl fixed bottom-4 md:bottom-6 right-4 md:right-10 z-50">
        <Link href="/" className={`interactive ${pathname === "/" ? "text-2xl lg:text-3xl" : ""}`}>iNdex,</Link>
        <Link href="/work" className={`interactive ${pathname === "/work" ? "text-2xl lg:text-3xl" : ""}`}>wOrk,</Link>
      </div>
      <div id="site-content-scroll" className="h-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}