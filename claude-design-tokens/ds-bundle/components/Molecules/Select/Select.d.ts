import type { ReactNode } from "react";

/**
 * Select — Выпадающий список (закрыт/открыт).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Select.html. See the project README for the idiom.
 */
export interface SelectProps {
  state?: "Default" | "Open";
  className?: string;
}
