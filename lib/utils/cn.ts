/**
 * Combines class names, filtering out falsy values.
 * Avoids a clsx dependency — keeps the bundle light.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
