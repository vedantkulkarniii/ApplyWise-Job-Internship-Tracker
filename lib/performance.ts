/**
 * Performance optimization utilities for ApplyWise
 */

/**
 * Debounce function to limit function execution rate
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure function executes at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Memoize function results to avoid expensive recalculations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Cache manager for localStorage with expiration
 */
export class CacheManager {
  private prefix: string;

  constructor(prefix: string = 'applywise_cache') {
    this.prefix = prefix;
  }

  /**
   * Set a cached value with optional expiration time (in milliseconds)
   */
  set(key: string, value: any, ttl?: number): void {
    if (typeof window === 'undefined') return;

    const data = {
      value,
      timestamp: Date.now(),
      ttl: ttl || null,
    };

    try {
      localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  /**
   * Get a cached value if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(`${this.prefix}_${key}`);
      if (!item) return null;

      const data = JSON.parse(item);
      
      // Check if expired
      if (data.ttl && Date.now() - data.timestamp > data.ttl) {
        this.remove(key);
        return null;
      }

      return data.value as T;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  /**
   * Remove a cached value
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${this.prefix}_${key}`);
  }

  /**
   * Clear all cached values with this prefix
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Remove expired cache entries
   */
  cleanup(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.ttl && Date.now() - data.timestamp > data.ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  }
}

/**
 * Lazy load data with optional cache
 */
export async function lazyLoad<T>(
  loader: () => Promise<T>,
  cacheKey?: string,
  cacheTtl?: number
): Promise<T> {
  if (cacheKey) {
    const cache = new CacheManager();
    const cached = cache.get<T>(cacheKey);
    
    if (cached !== null) {
      return cached;
    }

    const result = await loader();
    cache.set(cacheKey, result, cacheTtl);
    return result;
  }

  return loader();
}

/**
 * Batch operations to reduce render cycles
 */
export class BatchProcessor<T> {
  private queue: T[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private processor: (items: T[]) => void;
  private delay: number;

  constructor(processor: (items: T[]) => void, delay: number = 100) {
    this.processor = processor;
    this.delay = delay;
  }

  add(item: T): void {
    this.queue.push(item);
    this.scheduleProcessing();
  }

  addMultiple(items: T[]): void {
    this.queue.push(...items);
    this.scheduleProcessing();
  }

  private scheduleProcessing(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush(): void {
    if (this.queue.length === 0) return;

    const items = [...this.queue];
    this.queue = [];
    this.processor(items);

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

/**
 * Virtual scrolling helper for large lists
 */
export function calculateVisibleItems<T>(
  items: T[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
): { startIndex: number; endIndex: number; visibleItems: T[]; offsetY: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return { startIndex, endIndex, visibleItems, offsetY };
}

/**
 * Measure rendering performance
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(label);

    if (duration > 100) {
      console.warn(`⚠️ Slow operation: ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label);
  }

  async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    await fn();
    return this.end(label);
  }
}

/**
 * Request Animation Frame helper for smooth animations
 */
export function scheduleWork(callback: () => void): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * Optimize image loading
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if localStorage is available and has space
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get approximate localStorage usage
 */
export function getStorageUsage(): { used: number; total: number; percentage: number } {
  if (typeof window === 'undefined') {
    return { used: 0, total: 0, percentage: 0 };
  }

  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Most browsers limit to ~5-10MB
  const total = 5 * 1024 * 1024; // Assume 5MB
  const percentage = (used / total) * 100;

  return { used, total, percentage };
}
