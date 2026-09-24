import type { ReactNode } from "react";

/**
 * Toast — Всплывающее тост-уведомление.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Toast.html. See the project README for the idiom.
 */
export interface ToastProps {
  variant?: "Success" | "Error" | "Info";
  children?: ReactNode;
  className?: string;
}
