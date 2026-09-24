import type { ReactNode } from "react";

/**
 * Tooltip — Тёмная всплывающая подсказка.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Tooltip.html. See the project README for the idiom.
 */
export interface TooltipProps {
  children?: ReactNode;
  className?: string;
}
