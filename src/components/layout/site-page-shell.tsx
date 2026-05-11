import type { ReactNode } from "react";
import { BrandName } from "@/components/common/brand-name";

type SitePageShellProps = {
  children: ReactNode;
};

export function SitePageShell({ children }: SitePageShellProps) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed top-10 right-10 z-50">
        <BrandName />
      </div>
      {children}
    </div>
  );
}