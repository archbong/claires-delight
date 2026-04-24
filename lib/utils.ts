// Utility function for conditionally joining class names
// Similar to clsx or classnames library
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
