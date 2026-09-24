import type { ReactNode } from "react";

/**
 * Divider — Разделитель (горизонтальный/вертикальный, опц. с подписью).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Divider.html. See the project README for the idiom.
 */
export interface DividerProps {
  orientation?: "Horizontal" | "Vertical";
  className?: string;
}
