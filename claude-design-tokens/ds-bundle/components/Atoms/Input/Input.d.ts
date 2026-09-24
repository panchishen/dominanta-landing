import type { ReactNode } from "react";

/**
 * Input — Текстовое поле формы с лейблом, хелпером и состояниями валидации.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Input.html. See the project README for the idiom.
 */
export interface InputProps {
  /** default: "Имя" */
  label?: string;
  /** default: "Ваше имя" */
  value?: string;
  /** default: "true" */
  helper?: boolean;
  /** default: "false" */
  required?: boolean;
  state?: "Default" | "Hover" | "Focus" | "Filled" | "Error" | "Disabled";
  className?: string;
}
