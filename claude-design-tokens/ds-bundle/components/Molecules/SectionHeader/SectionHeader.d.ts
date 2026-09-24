import type { ReactNode } from "react";

/**
 * SectionHeader — Заголовок секции лендинга (надзаголовок + заголовок + описание).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in SectionHeader.html. See the project README for the idiom.
 */
export interface SectionHeaderProps {
  children?: ReactNode;
  className?: string;
}
