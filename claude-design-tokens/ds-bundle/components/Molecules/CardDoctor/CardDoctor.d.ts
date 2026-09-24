import type { ReactNode } from "react";

/**
 * CardDoctor — Карточка врача.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in CardDoctor.html. See the project README for the idiom.
 */
export interface CardDoctorProps {
  children?: ReactNode;
  className?: string;
}
