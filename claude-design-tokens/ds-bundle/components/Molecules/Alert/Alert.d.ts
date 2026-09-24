import type { ReactNode } from "react";

/**
 * Alert — Инлайн-уведомление (info/success/warning/error).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Alert.html. See the project README for the idiom.
 */
export interface AlertProps {
  variant?: "Info" | "Success" | "Warning" | "Error";
  children?: ReactNode;
  className?: string;
}
