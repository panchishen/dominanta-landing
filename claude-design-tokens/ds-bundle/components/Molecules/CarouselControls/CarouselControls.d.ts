import type { ReactNode } from "react";

/**
 * CarouselControls — Управление каруселью: стрелки + точки.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in CarouselControls.html. See the project README for the idiom.
 */
export interface CarouselControlsProps {
  children?: ReactNode;
  className?: string;
}
