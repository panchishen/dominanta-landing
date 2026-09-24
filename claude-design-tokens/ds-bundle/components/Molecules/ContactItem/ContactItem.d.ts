import type { ReactNode } from "react";

/**
 * ContactItem — Строка контакта (адрес/телефон/почта/часы).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in ContactItem.html. See the project README for the idiom.
 */
export interface ContactItemProps {
  type?: "Address" | "Phone" | "Email" | "Hours";
  className?: string;
}
