import type { ReactNode } from "react";

/**
 * CardService — Карточка услуги клиники.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in CardService.html. See the project README for the idiom.
 */
export interface CardServiceProps {
  state?: "Default" | "Hover";
  children?: ReactNode;
  className?: string;
}
