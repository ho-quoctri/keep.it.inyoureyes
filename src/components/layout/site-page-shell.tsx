'use client';

import { useEffect, useState, type ReactNode } from "react";
import { BrandName } from "@/components/common/brand-name";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";


type SitePageShellProps = {
  children: ReactNode;
};

export function SitePageShell({ children }: SitePageShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(pathname);
  }, [pathname]);

  return (
    <div className="relative h-screen overflow-hidden transform isolate">
      <div className="fixed top-10 right-10 z-50" onClick={() => router.push("/")}>
        <BrandName />
      </div>
      <p className="text-sm fixed bottom-6 left-10 z-50">
        &copy; {new Date().getFullYear()} - keep.it.iNyourEyes
      </p>
      <div className="flex flex-col text-right items-end text-lg lg:text-xl fixed bottom-6 right-10 z-50">
        <Link href="/" className={`interactive ${currentPage === "/" ? "text-2xl lg:text-3xl" : ""}`}>indeX,</Link>
        <Link href="/work" className={`interactive ${currentPage === "/work" ? "text-2xl lg:text-3xl" : ""}`}>Work,</Link>
      </div>
      <div id="site-content-scroll" className="h-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}