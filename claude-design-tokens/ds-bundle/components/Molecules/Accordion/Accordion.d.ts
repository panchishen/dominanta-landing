import type { ReactNode } from "react";

/**
 * Accordion — Аккордеон/FAQ со сворачиваемыми секциями.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Accordion.html. See the project README for the idiom.
 */
export interface AccordionProps {
  state?: "Collapsed" | "Expanded";
  children?: ReactNode;
  className?: string;
}
