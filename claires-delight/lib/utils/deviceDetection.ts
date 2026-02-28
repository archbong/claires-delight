// Kiro Requirement: 4.1 - Modern UI/UX Patterns
// Kiro Requirement: 6.1 - Enhanced Add-to-Cart Experience
// Kiro Requirement: 4.4 - Visual Feedback

/**
 * Device detection and touch optimization utilities
 * Provides helpers for mobile device detection, touch interactions, and optimization
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  userAgent: string;
}

export interface TouchOptimizationOptions {
  minTouchSize?: number;
  hoverEffects?: boolean;
  longPressDelay?: number;
  swipeThreshold?: number;
}

class DeviceDetection {
  private static instance: DeviceDetection;
  private deviceInfo: DeviceInfo;
  private touchOptions: TouchOptimizationOptions;

  private constructor() {
    this.deviceInfo = this.detectDevice();
    this.touchOptions = {
      minTouchSize: 44,
      hoverEffects: true,
      longPressDelay: 500,
      swipeThreshold: 50
    };

    // Add touch event listeners for better UX
    this.initializeTouchOptimization();
  }

  public static getInstance(): DeviceDetection {
    if (!DeviceDetection.instance) {
      DeviceDetection.instance = new DeviceDetection();
    }
    return DeviceDetection.instance;
  }

  private detectDevice(): DeviceInfo {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isIOS: false,
        isAndroid: false,
        isSafari: false,
        isChrome: false,
        isFirefox: false,
        screenWidth: 0,
        screenHeight: 0,
        pixelRatio: 1,
        userAgent: ''
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isChrome = /chrome/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);

    // More accurate mobile detection
    const isMobile = isIOS || isAndroid || /windows phone/.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    // Touch device detection
    const isTouchDevice = 'ontouchstart' in window ||
                         navigator.maxTouchPoints > 0 ||
                         (navigator as any).msMaxTouchPoints > 0;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      isFirefox,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      userAgent: navigator.userAgent
    };
  }

  private initializeTouchOptimization(): void {
    if (typeof document === 'undefined') return;

    // Add touch-specific CSS classes
    if (this.deviceInfo.isTouchDevice) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.add('no-touch-device');
    }

    if (this.deviceInfo.isIOS) {
      document.documentElement.classList.add('ios-device');
    }

    if (this.deviceInfo.isAndroid) {
      document.documentElement.classList.add('android-device');
    }

    // Prevent zoom on double-tap (for better button UX)
    if (this.deviceInfo.isTouchDevice) {
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, { passive: false });
    }
  }

  public getDeviceInfo(): DeviceInfo {
    return { ...this.deviceInfo };
  }

  public updateDeviceInfo(): void {
    this.deviceInfo = this.detectDevice();
  }

  public setTouchOptions(options: Partial<TouchOptimizationOptions>): void {
    this.touchOptions = { ...this.touchOptions, ...options };
  }

  public getTouchOptions(): TouchOptimizationOptions {
    return { ...this.touchOptions };
  }

  public isMobileDevice(): boolean {
    return this.deviceInfo.isMobile;
  }

  public isTabletDevice(): boolean {
    return this.deviceInfo.isTablet;
  }

  public isDesktopDevice(): boolean {
    return this.deviceInfo.isDesktop;
  }

  public isTouchDevice(): boolean {
    return this.deviceInfo.isTouchDevice;
  }

  public isIOSDevice(): boolean {
    return this.deviceInfo.isIOS;
  }

  public isAndroidDevice(): boolean {
    return this.deviceInfo.isAndroid;
  }

  public getScreenSize(): { width: number; height: number } {
    return {
      width: this.deviceInfo.screenWidth,
      height: this.deviceInfo.screenHeight
    };
  }

  public getPixelRatio(): number {
    return this.deviceInfo.pixelRatio;
  }

  /**
   * Optimize element for touch interactions
   */
  public optimizeForTouch(element: HTMLElement): void {
    if (!this.deviceInfo.isTouchDevice) return;

    // Ensure minimum touch target size
    const style = window.getComputedStyle(element);
    const width = parseInt(style.width) || 0;
    const height = parseInt(style.height) || 0;
    const minSize = this.touchOptions.minTouchSize;

    if (width < minSize || height < minSize) {
      const padding = Math.max(0, (minSize - Math.min(width, height)) / 2);
      element.style.padding = `${padding}px`;
    }

    // Add touch-specific classes
    element.classList.add('touch-optimized');
  }

  /**
   * Check if current device supports hover effects
   */
  public supportsHover(): boolean {
    return !this.deviceInfo.isTouchDevice && this.touchOptions.hoverEffects;
  }

  /**
   * Debounce touch events to prevent accidental taps
   */
  public debounceTouch(callback: Function, delay: number = 100): Function {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }

  /**
   * Add visual feedback for touch interactions
   */
  public addTouchFeedback(element: HTMLElement): () => void {
    if (!this.deviceInfo.isTouchDevice) return () => {};

    const handleTouchStart = () => {
      element.classList.add('touch-active');
    };

    const handleTouchEnd = () => {
      element.classList.remove('touch-active');
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }
}

// Singleton instance
export const device = DeviceDetection.getInstance();

// React hook style convenience functions
export const useDevice = () => {
  return {
    deviceInfo: device.getDeviceInfo(),
    isMobile: device.isMobileDevice(),
    isTablet: device.isTabletDevice(),
    isDesktop: device.isDesktopDevice(),
    isTouch: device.isTouchDevice(),
    isIOS: device.isIOSDevice(),
    isAndroid: device.isAndroidDevice(),
    screenSize: device.getScreenSize(),
    pixelRatio: device.getPixelRatio(),
    supportsHover: device.supportsHover(),
    optimizeForTouch: (element: HTMLElement) => device.optimizeForTouch(element),
    addTouchFeedback: (element: HTMLElement) => device.addTouchFeedback(element),
    debounceTouch: (callback: Function, delay?: number) => device.debounceTouch(callback, delay)
  };
};

// Default export
export default device;
