import type { ReactNode } from "react";

/**
 * Logo — Логотип Кристалис (Default/Inverse).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Logo.html. See the project README for the idiom.
 */
export interface LogoProps {
  style?: "Default" | "Inverse";
  className?: string;
}
