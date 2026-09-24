import type { ReactNode } from "react";

/**
 * Tabs — Вкладки для переключения контента.
 * Spec derived from the Crystalis Figma library (variant/prop matrix).
 * NOTE: Crystalis ships no importable React components — build this from the
 * tokens and the markup in Tabs.html. See the project README for the idiom.
 */
export interface TabsProps {
  state?: "Active" | "Default" | "Hover";
  className?: string;
}
