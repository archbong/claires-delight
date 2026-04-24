/**
 * Currency formatting utilities for Claire's Delight
 * Provides consistent currency formatting throughout the application
 */

/**
 * Format amount as Nigerian Naira currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₦ 1,234.56")
 */
export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format amount as currency without symbol
 * @param amount - The amount to format
 * @returns Formatted amount string (e.g., "1,234.56")
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Extract numeric value from formatted currency string
 * @param formattedAmount - Formatted currency string
 * @returns Numeric value or null if invalid
 */
export const parseCurrency = (formattedAmount: string): number | null => {
  const numericValue = parseFloat(
    formattedAmount.replace(/[^\d.-]/g, '')
  );
  return isNaN(numericValue) ? null : numericValue;
};

/**
 * Calculate total amount for cart items
 * @param items - Array of items with price and quantity
 * @returns Formatted total amount
 */
export const calculateTotal = (items: Array<{ price: number; quantity: number }>): string => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return formatNaira(total);
};

/**
 * Validate currency amount
 * @param amount - Amount to validate
 * @returns Validation result with message
 */
export const validateCurrency = (amount: number): { isValid: boolean; message: string } => {
  if (amount <= 0) {
    return { isValid: false, message: "Amount must be greater than zero" };
  }
  if (amount > 1000000000) {
    return { isValid: false, message: "Amount exceeds maximum limit" };
  }
  return { isValid: true, message: "Valid amount" };
};
