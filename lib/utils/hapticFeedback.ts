// Kiro Requirement: 4.1 - Modern UI/UX Patterns
// Kiro Requirement: 6.1 - Enhanced Add-to-Cart Experience
// Kiro Requirement: 4.4 - Visual Feedback

/**
 * Haptic feedback utility for mobile devices
 * Provides vibration patterns for different user interactions
 */

export interface HapticOptions {
  duration?: number;
  intensity?: 'light' | 'medium' | 'heavy';
  enabled?: boolean;
}

export class HapticFeedback {
  private static instance: HapticFeedback;
  private isSupported: boolean;
  private isEnabled: boolean;

  private constructor() {
    this.isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;
    this.isEnabled = this.isSupported && !this.isReducedMotionPreferred();
  }

  public static getInstance(): HapticFeedback {
    if (!HapticFeedback.instance) {
      HapticFeedback.instance = new HapticFeedback();
    }
    return HapticFeedback.instance;
  }

  /**
   * Check if user prefers reduced motion
   */
  private isReducedMotionPreferred(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Enable or disable haptic feedback
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled && this.isSupported;
  }

  /**
   * Check if haptic feedback is currently enabled
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Check if haptic feedback is supported
   */
  public isHapticSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Light tap feedback (for button presses)
   */
  public lightTap(options: HapticOptions = {}): void {
    if (!this.isEnabled) return;
    const duration = options.duration || 50;
    navigator.vibrate(duration);
  }

  /**
   * Success feedback (for successful actions)
   */
  public success(options: HapticOptions = {}): void {
    if (!this.isEnabled) return;
    navigator.vibrate([50, 50, 50]);
  }

  /**
   * Error feedback (for failed actions)
   */
  public error(options: HapticOptions = {}): void {
    if (!this.isEnabled) return;
    navigator.vibrate([100, 50, 100]);
  }

  /**
   * Warning feedback (for warnings)
   */
  public warning(options: HapticOptions = {}): void {
    if (!this.isEnabled) return;
    navigator.vibrate([150, 50, 150]);
  }

  /**
   * Selection feedback (for item selection)
   */
  public selection(options: HapticOptions = {}): void {
    if (!this.isEnabled) return;
    navigator.vibrate(20);
  }

  /**
   * Impact feedback (for physical interactions)
   */
  public impact(options: HapticOptions = {}): void {
    if (!this.isEnabled) return;
    const intensity = options.intensity || 'medium';
    const durations = {
      light: 40,
      medium: 60,
      heavy: 80
    };
    navigator.vibrate(durations[intensity]);
  }

  /**
   * Notification feedback (for incoming notifications)
   */
  public notification(type: 'success' | 'warning' | 'error' = 'success'): void {
    if (!this.isEnabled) return;
    const patterns = {
      success: [50, 50, 50],
      warning: [100, 50, 100],
      error: [150, 50, 150, 50, 150]
    };
    navigator.vibrate(patterns[type]);
  }

  /**
   * Custom vibration pattern
   */
  public custom(pattern: number | number[]): void {
    if (!this.isEnabled) return;
    navigator.vibrate(pattern);
  }

  /**
   * Stop any ongoing vibration
   */
  public stop(): void {
    if (this.isSupported) {
      navigator.vibrate(0);
    }
  }
}

// Singleton instance export
export const haptic = HapticFeedback.getInstance();

// Hook-style convenience functions
export const useHaptic = () => {
  return {
    lightTap: (options?: HapticOptions) => haptic.lightTap(options),
    success: (options?: HapticOptions) => haptic.success(options),
    error: (options?: HapticOptions) => haptic.error(options),
    warning: (options?: HapticOptions) => haptic.warning(options),
    selection: (options?: HapticOptions) => haptic.selection(options),
    impact: (options?: HapticOptions) => haptic.impact(options),
    notification: (type: 'success' | 'warning' | 'error') => haptic.notification(type),
    custom: (pattern: number | number[]) => haptic.custom(pattern),
    stop: () => haptic.stop(),
    isSupported: haptic.isHapticSupported(),
    isEnabled: haptic.getEnabled(),
    setEnabled: (enabled: boolean) => haptic.setEnabled(enabled)
  };
};

// Default export
export default haptic;
