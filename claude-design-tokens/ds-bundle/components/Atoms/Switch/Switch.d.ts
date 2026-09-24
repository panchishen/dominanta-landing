import type { ReactNode } from "react";

/**
 * Switch — Переключатель вкл/выкл.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Switch.html. See the project README for the idiom.
 */
export interface SwitchProps {
  state?: "Off" | "On" | "Disabled";
  className?: string;
}
