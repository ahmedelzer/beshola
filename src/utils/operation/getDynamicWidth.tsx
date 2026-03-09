/**
 * Calculates a dynamic width for a component based on text length.
 * * @param text - The string to measure.
 * @param charWidth - Average width of a character in pixels (default 8).
 * @param extraSpace - Sum of icon width, margins, and padding (default 30).
 * @returns A number representing the calculated width.
 */
export const getDynamicWidth = (
  text: string = "",
  charWidth: number = 8,
  extraSpace: number = 30,
): number => {
  if (!text) return 60; // Minimum default width for empty states

  const length = text.length;

  // Logic: (Length * Character Width) + Padding/Icons
  const calculatedWidth = length * charWidth + extraSpace;

  // Constraints: Min 80px, Max 160px (to prevent UI breaking)
  return Math.min(Math.max(calculatedWidth, 80), 160);
};
