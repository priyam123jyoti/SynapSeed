import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes without conflicts.
 * Essential for "No Loophole" UI performance.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an SEO-optimized slug from a string.
 * Converts "World Environment Day 2026!" -> "world-environment-day-2026"
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove all non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-')    // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, '');    // Trim hyphens from start and end
};

/**
 * Formats a raw date string into the "DD MMM" format used in your UI.
 * This ensures consistency even if a professor types "2026-06-05".
 */
export const formatEventDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    }).toUpperCase(); // Returns "05 JUN"
  } catch (e) {
    return dateStr; // Fallback to raw string if it's not a standard date
  }
};