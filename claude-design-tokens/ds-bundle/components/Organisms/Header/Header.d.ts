import type { ReactNode } from "react";

/**
 * Header — Шапка сайта (4 стиля: Standard/Dark/Floating/Two-tier).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Header.html. See the project README for the idiom.
 */
export interface HeaderProps {
  style?: "Standard" | "Dark" | "Floating" | "Two-tier";
  children?: ReactNode;
  className?: string;
}
