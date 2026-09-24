import type { ReactNode } from "react";

/**
 * IconButton — Кнопка только с иконкой.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in IconButton.html. See the project README for the idiom.
 */
export interface IconButtonProps {
  variant?: "Primary" | "Secondary" | "Ghost";
  className?: string;
}
