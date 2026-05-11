"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type MagneticButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function MagneticButton({ children, ...props }: MagneticButtonProps) {
  return <button {...props}>{children}</button>;
}