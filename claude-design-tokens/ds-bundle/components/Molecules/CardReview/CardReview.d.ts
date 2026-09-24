import type { ReactNode } from "react";

/**
 * CardReview — Карточка отзыва пациента.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in CardReview.html. See the project README for the idiom.
 */
export interface CardReviewProps {
  children?: ReactNode;
  className?: string;
}
