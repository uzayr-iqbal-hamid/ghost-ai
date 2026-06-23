/**
 * Fixed palette of vivid cursor colors tuned to read clearly on the dark
 * canvas. Kept independent of the theme tokens in `globals.css` — cursor colors
 * must stay saturated and distinct from one another, not blend into surfaces.
 */
export const CURSOR_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6BD6",
  "#A66BFF",
  "#FF924C",
  "#22D3EE",
  "#34D399",
  "#F472B6",
] as const;

/**
 * Deterministically maps a user ID to a consistent color from
 * {@link CURSOR_COLORS}. The same user always resolves to the same color, so a
 * person keeps one cursor color across sessions and devices.
 */
export function getCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
}
