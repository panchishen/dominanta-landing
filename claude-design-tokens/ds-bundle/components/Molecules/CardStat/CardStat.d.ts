import type { ReactNode } from "react";

/**
 * CardStat — Карточка метрики/цифры клиники.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in CardStat.html. See the project README for the idiom.
 */
export interface CardStatProps {
  children?: ReactNode;
  className?: string;
}
