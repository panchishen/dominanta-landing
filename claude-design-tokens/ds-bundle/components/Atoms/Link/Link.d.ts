import type { ReactNode } from "react";

/**
 * Link — Текстовая ссылка с состояниями.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Link.html. See the project README for the idiom.
 */
export interface LinkProps {
  state?: "Default" | "Hover" | "Pressed" | "Visited" | "Disabled";
  className?: string;
}
