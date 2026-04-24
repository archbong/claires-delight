import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timeout
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout on unmount or when value/delay changes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing with callback
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}

/**
 * Custom hook for debouncing with immediate execution option
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @param immediate Whether to execute immediately on first call
 * @returns Debounced callback
 */
export function useDebouncedCallbackAdvanced<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastExecuted, setLastExecuted] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecuted = now - lastExecuted;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (immediate && timeSinceLastExecuted >= delay) {
      callback(...args);
      setLastExecuted(now);
    } else {
      const newTimeoutId = setTimeout(() => {
        callback(...args);
        setLastExecuted(Date.now());
      }, delay);

      setTimeoutId(newTimeoutId);
    }
  };
}

/**
 * Custom hook for debouncing with leading and trailing options
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @param options Options for leading/trailing execution
 * @returns Debounced callback
 */
export function useDebouncedCallbackWithOptions<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): (...args: Parameters<T>) => void {
  const { leading = false, trailing = true, maxWait } = options;
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastExecuted, setLastExecuted] = useState<number>(0);
  const [lastArgs, setLastArgs] = useState<Parameters<T> | null>(null);
  const [maxTimeoutId, setMaxTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
    };
  }, [timeoutId, maxTimeoutId]);

  const executeCallback = (args: Parameters<T>) => {
    callback(...args);
    setLastExecuted(Date.now());
    setLastArgs(null);
  };

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const isLeadingCall = lastExecuted === 0;
    const shouldExecuteLeading = leading && isLeadingCall;

    setLastArgs(args);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (shouldExecuteLeading) {
      executeCallback(args);
    }

    if (trailing) {
      const newTimeoutId = setTimeout(() => {
        if (lastArgs && (!leading || !isLeadingCall)) {
          executeCallback(lastArgs);
        }
      }, delay);

      setTimeoutId(newTimeoutId);
    }

    if (maxWait && !maxTimeoutId) {
      const newMaxTimeoutId = setTimeout(() => {
        if (lastArgs) {
          executeCallback(lastArgs);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      }, maxWait);

      setMaxTimeoutId(newMaxTimeoutId);
    }
  };
}

/**
 * Hook to debounce a value with additional metadata
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 * @returns Object containing debounced value and metadata
 */
export function useDebounceWithMetadata<T>(
  value: T,
  delay: number
): {
  debouncedValue: T;
  isDebouncing: boolean;
  lastChangeTime: number;
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [lastChangeTime, setLastChangeTime] = useState<number>(Date.now());

  useEffect(() => {
    setIsDebouncing(true);
    setLastChangeTime(Date.now());

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return {
    debouncedValue,
    isDebouncing,
    lastChangeTime,
  };
}

export default useDebounce;
