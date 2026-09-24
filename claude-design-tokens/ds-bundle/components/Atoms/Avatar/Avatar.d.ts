import type { ReactNode } from "react";

/**
 * Avatar — Аватар пользователя/врача: инициалы, иконка или фото.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Avatar.html. See the project README for the idiom.
 */
export interface AvatarProps {
  type?: "Initials" | "Icon" | "Image";
  size?: "SM" | "MD" | "LG";
  className?: string;
}
