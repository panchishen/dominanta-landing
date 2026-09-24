import type { ReactNode } from "react";

/**
 * Badge — Метка-индикатор статуса или категории.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Badge.html. See the project README for the idiom.
 */
export interface BadgeProps {
  variant?: "Neutral" | "Primary" | "Success" | "Warning" | "Error" | "Accent";
  className?: string;
}
