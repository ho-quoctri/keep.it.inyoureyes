"use client";

import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";

type TransitionLinkProps = PropsWithChildren<LinkProps> & {
  className?: string;
};

export function TransitionLink({ children, className, ...props }: TransitionLinkProps) {
  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  );
}