import type { ReactNode } from "react";

/**
 * Rating — Рейтинг звёздами.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Rating.html. See the project README for the idiom.
 */
export interface RatingProps {
  value?: "3" | "4" | "5";
  className?: string;
}
