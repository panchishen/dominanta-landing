import type { ReactNode } from "react";

/**
 * Button — Основная кнопка-действие (CTA «Записаться» и т.п.).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Button.html. See the project README for the idiom.
 */
export interface ButtonProps {
  /** default: "Записаться" */
  label?: string;
  /** default: "false" */
  iconLeft?: boolean;
  /** default: "false" */
  iconRight?: boolean;
  variant?: "Primary" | "Secondary" | "Accent" | "White";
  size?: "SM" | "MD" | "LG";
  className?: string;
}
