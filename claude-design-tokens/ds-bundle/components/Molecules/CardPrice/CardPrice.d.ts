import type { ReactNode } from "react";

/**
 * CardPrice — Карточка тарифа/цены (обычная и «популярная»).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in CardPrice.html. See the project README for the idiom.
 */
export interface CardPriceProps {
  popular?: "False" | "True";
  children?: ReactNode;
  className?: string;
}
