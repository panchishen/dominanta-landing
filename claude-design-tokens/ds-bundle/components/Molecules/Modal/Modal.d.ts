import type { ReactNode } from "react";

/**
 * Modal — Модальное окно (диалог записи).
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Modal.html. See the project README for the idiom.
 */
export interface ModalProps {
  children?: ReactNode;
  className?: string;
}
