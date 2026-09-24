import type { ReactNode } from "react";

/**
 * Checkbox — Чекбокс для множественного выбора и согласий.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Checkbox.html. See the project README for the idiom.
 */
export interface CheckboxProps {
  state?: "Unchecked" | "Checked" | "Indeterminate" | "Disabled";
  className?: string;
}
