import type { ReactNode } from "react";

/**
 * Radio — Радиокнопка для выбора одного значения из группы.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Radio.html. See the project README for the idiom.
 */
export interface RadioProps {
  state?: "Unselected" | "Selected" | "Disabled";
  className?: string;
}
