import type { ReactNode } from "react";

/**
 * Footer — Подвал сайта.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Footer.html. See the project README for the idiom.
 */
export interface FooterProps {
  children?: ReactNode;
  className?: string;
}
